import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './types';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const userExists = this.users.find(user => user.email === dto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const newUser: User = {
      id: this.users.length + 1,
      email: dto.email,
      password: dto.password // In production, hash the password!
    };

    this.users.push(newUser);

    return { message: 'Registration successful' };
  }

  async login(dto: LoginDto) {
    const user = this.users.find(user => user.email === dto.email && user.password === dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
