import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './types';

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const userExists = this.users.find(u => u.email === registerDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const newUser: User = {
      id: this.users.length + 1,
      email: registerDto.email,
      password: registerDto.password // ❗ In production, hash this
    };
    this.users.push(newUser);

    return { message: 'Registration successful', user: newUser };
  }

  async login(loginDto: LoginDto) {
    const user = this.users.find(
      u => u.email === loginDto.email && u.password === loginDto.password
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }
}
