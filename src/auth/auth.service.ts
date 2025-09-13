// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './types';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private generateJwt(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      'secretKey', // ⚠️ Replace with env variable later
      { expiresIn: '1d' },
    );
  }

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const user = this.userService.createUser(registerDto);
    const token = this.generateJwt(user);
    return { user, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const user = this.userService
      .getAllUsers()
      .find((u) => u.email === loginDto.email && u.password === loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateJwt(user);
    return { user, token };
  }

  async registerResident(
    inviteToken: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const result = this.userService.registerResident(inviteToken, password);

    if (!result.success) {
      throw new UnauthorizedException(result.message);
    }

    const token = this.generateJwt(result.user);
    return { user: result.user, token };
  }
}
