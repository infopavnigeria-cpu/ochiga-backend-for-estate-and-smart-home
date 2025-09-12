// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './types';

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      email: 'ada@p2e.com',
      password: 'password123',
      role: 'manager',
      estate: 'P2E Estate',
      name: 'Ada',
      house: 'B12',
    },
    {
      id: 2,
      email: 'emeka@green.com',
      password: 'mypassword',
      role: 'resident',
      estate: 'GreenVille',
      name: 'Emeka',
      house: 'C4',
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const userExists = this.users.find(u => u.email === registerDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const newUser: User = {
      id: this.users.length + 1,
      ...registerDto,
    };

    this.users.push(newUser);

    const token = this.jwtService.sign({ sub: newUser.id, email: newUser.email, role: newUser.role });

    return { user: newUser, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const user = this.users.find(
      u => u.email === loginDto.email && u.password === loginDto.password
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    return { user, token };
  }
}
