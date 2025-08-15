// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './types';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const userExists = this.users.find(u => u.email === registerDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const newUser: User = {
      id: this.users.length + 1,
      email: registerDto.email,
      password: registerDto.password // In production, hash this password!
    };

    this.users.push(newUser);

    const token = this.jwtService.sign({ sub: newUser.id, email: newUser.email });

    return { user: newUser, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const user = this.users.find(
      u => u.email === loginDto.email && u.password === loginDto.password
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return { user, token };
  }
}
