// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '1d' },
    );
  }

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
      role: registerDto.role ?? UserRole.RESIDENT,
    });

    const token = this.generateJwt(user);
    return { user, token };
  }

  async registerResident(inviteToken: string, password: string): Promise<{ user: User; token: string }> {
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

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
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
