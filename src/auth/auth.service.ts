import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService, User } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private generateJwt(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'supersecret', // ✅ env variable later
      { expiresIn: '1d' },
    );
  }

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const user = this.userService.createUser(registerDto);
    const token = this.generateJwt(user);
    return { user, token };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const user = this.userService.findByEmail(loginDto.email);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateJwt(user);
    return { user, token };
  }
}
