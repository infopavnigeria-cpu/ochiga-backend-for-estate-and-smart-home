// src/auth/token.service.ts
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private rtRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  private parseExpiryMs(exp: string) {
    const num = parseInt(exp.slice(0, -1), 10);
    const unit = exp.slice(-1);
    switch (unit) {
      case 's':
        return num * 1000;
      case 'm':
        return num * 60 * 1000;
      case 'h':
        return num * 3600 * 1000;
      case 'd':
        return num * 24 * 3600 * 1000;
      default:
        return 30 * 24 * 3600 * 1000;
    }
  }

  /**
   * Generate and store a refresh token (returns raw token)
   */
  async generateRefreshToken(userId: string, deviceInfo?: string) {
    const raw = crypto.randomBytes(64).toString('hex');
    const hash = await bcrypt.hash(raw, 10);
    const expiresIn = process.env.JWT_REFRESH_EXPIRY || '30d';
    const expiresAt = new Date(Date.now() + this.parseExpiryMs(expiresIn));

    const row = this.rtRepo.create({
      userId,
      tokenHash: hash,
      deviceInfo,
      expiresAt,
      revoked: false,
    });
    await this.rtRepo.save(row);
    return raw;
  }

  /**
   * Validate a raw refresh token by iterating non-revoked rows and comparing
   * using bcrypt. (Existing approach preserved for backward compatibility.)
   * NOTE: This is O(N) on number of active tokens. For large-scale deployments,
   * consider storing a sha256 lookup column or a separate keyed store.
   */
  async validateRefreshTokenByRaw(raw: string) {
    const rows = await this.rtRepo.find({ where: { revoked: false } });
    for (const r of rows) {
      const ok = await bcrypt.compare(raw, r.tokenHash);
      if (ok && (!r.expiresAt || r.expiresAt > new Date())) return r;
    }
    return null;
  }

  async revoke(rt: RefreshToken) {
    rt.revoked = true;
    await this.rtRepo.save(rt);
  }

  /***************************
   * Invite token helpers
   *
   * We issue short-lived signed invite tokens (JWT) that contain:
   * { email, estate, house, name? }
   *
   * These are stateless (no DB table), safe for invites, and easy to validate.
   ***************************/

  /**
   * Generate a signed invite token (JWT). Expires by default in 7 days.
   */
  generateInviteToken(payload: {
    email: string;
    estate: string;
    house: string;
    name?: string;
  }): string {
    const secret = process.env.JWT_INVITE_SECRET || process.env.JWT_SECRET || 'invite-secret';
    const expiresIn = process.env.JWT_INVITE_EXPIRY || '7d';
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  /**
   * Validate invite token and return the decoded payload, or throw if invalid.
   */
  async validateInviteToken(raw: string): Promise<{
    email: string;
    estate: string;
    house: string;
    name?: string;
  } | null> {
    const secret = process.env.JWT_INVITE_SECRET || process.env.JWT_SECRET || 'invite-secret';
    try {
      const decoded = await this.jwtService.verifyAsync(raw, { secret });
      // minimal validation
      if (!decoded || !decoded.email || !decoded.estate || !decoded.house) return null;
      return {
        email: decoded.email,
        estate: decoded.estate,
        house: decoded.house,
        name: decoded.name,
      };
    } catch {
      return null;
    }
  }
}
