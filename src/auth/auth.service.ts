// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../enums/user-role.enum';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private generateJwt(user: User): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET not configured');
    }

    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '1d' },
    );
  }

  // ✅ Secure register with error handling
  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; token: string }> {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword, // ✅ store hash
        role: registerDto.role ?? UserRole.RESIDENT,
      });

      const token = this.generateJwt(user);
      return { user, token };
    } catch (err) {
      console.error('❌ AuthService.register error:', err);

      if (err.code === 'SQLITE_CONSTRAINT' || err.code === '23505') {
        // SQLite or Postgres unique constraint violation
        throw new BadRequestException('User already exists');
      }

      throw new InternalServerErrorException(
        err.message || 'Registration failed',
      );
    }
  }

  // ✅ Resident registration via invite
  async registerResident(
    inviteToken: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    if (!inviteToken || inviteToken !== 'VALID_INVITE') {
      throw new UnauthorizedException('Invalid invite token');
    }

    const email = `resident+${Date.now()}@ochiga.com`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
      role: UserRole.RESIDENT,
    });

    const token = this.generateJwt(user);
    return { user, token };
  }

  // ✅ Login with bcrypt password check
  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateJwt(user);
    return { user, token };
  }
}
