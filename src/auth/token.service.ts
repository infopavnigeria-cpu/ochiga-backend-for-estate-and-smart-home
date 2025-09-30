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
   * Helper: compute sha256 hex digest of raw token
   */
  private sha256Hex(input: string) {
    return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
  }

  /**
   * Generate and store a refresh token (returns raw token).
   * Stores:
   * - tokenHash (bcrypt) for compatibility / replay protection
   * - tokenSha256 (sha256 hex) for fast indexed lookup
   */
  async generateRefreshToken(userId: string, deviceInfo?: string) {
    const raw = crypto.randomBytes(64).toString('hex'); // raw token (returned to user)
    const hash = await bcrypt.hash(raw, 10); // bcrypt store for backward compatibility
    const sha256 = this.sha256Hex(raw); // quick lookup value

    const expiresIn = process.env.JWT_REFRESH_EXPIRY || '30d';
    const expiresAt = new Date(Date.now() + this.parseExpiryMs(expiresIn));

    const row = this.rtRepo.create({
      userId,
      tokenHash: hash,
      tokenSha256: sha256,
      deviceInfo,
      expiresAt,
      revoked: false,
    });
    await this.rtRepo.save(row);
    return raw;
  }

  /**
   * Validate a raw refresh token.
   * Strategy:
   * 1) Compute sha256(raw) and try indexed DB lookup. If found and valid => return row.
   * 2) If not found, fall back to scanning non-revoked rows and bcrypt.compare (legacy tokens).
   *
   * This approach is backward-compatible and migrates clients to sha256 lookup transparently.
   */
  async validateRefreshTokenByRaw(raw: string) {
    const sha = this.sha256Hex(raw);

    // 1) Fast path: indexed lookup on tokenSha256
    const rowBySha = await this.rtRepo.findOne({ where: { tokenSha256: sha, revoked: false } });
    if (rowBySha) {
      if (!rowBySha.expiresAt || rowBySha.expiresAt > new Date()) {
        return rowBySha;
      }
      // expired - return null
      return null;
    }

    // 2) Fallback: legacy bcrypt scan (existing behavior)
    const rows = await this.rtRepo.find({ where: { revoked: false } });
    for (const r of rows) {
      try {
        // if tokenHash exists, compare
        if (r.tokenHash) {
          const ok = await bcrypt.compare(raw, r.tokenHash);
          if (ok && (!r.expiresAt || r.expiresAt > new Date())) {
            return r;
          }
        }
      } catch {
        // ignore compare errors and continue
      }
    }

    return null;
  }

  async revoke(rt: RefreshToken) {
    rt.revoked = true;
    await this.rtRepo.save(rt);
  }

  /***************************
   * Invite token helpers (stateless JWT invites)
   ***************************/

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

  async validateInviteToken(raw: string): Promise<{
    email: string;
    estate: string;
    house: string;
    name?: string;
  } | null> {
    const secret = process.env.JWT_INVITE_SECRET || process.env.JWT_SECRET || 'invite-secret';
    try {
      const decoded = await this.jwtService.verifyAsync(raw, { secret });
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
