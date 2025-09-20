import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private rtRepo: Repository<RefreshToken>,
  ) {}

  private parseExpiryMs(exp: string) {
    const num = parseInt(exp.slice(0, -1), 10);
    const unit = exp.slice(-1);
    switch (unit) {
      case 's': return num * 1000;
      case 'm': return num * 60 * 1000;
      case 'h': return num * 3600 * 1000;
      case 'd': return num * 24 * 3600 * 1000;
      default: return 30 * 24 * 3600 * 1000;
    }
  }

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
}
