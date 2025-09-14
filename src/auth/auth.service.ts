import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService, User } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from './enums/user-role.enum';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private generateJwt(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1d' },
    );
  }

  async register(registerDto: RegisterDto): Promise<{ user: User; token: string }> {
    const user = this.userService.createUser({
      ...registerDto,
      role: registerDto.role ?? UserRole.RESIDENT, // default to resident
    });

    const token = this.generateJwt(user);
    return { user, token };
  }

  async registerResident(inviteToken: string, password: string): Promise<{ user: User; token: string }> {
    // ✅ placeholder invite validation (replace with real service later)
    if (!inviteToken || inviteToken !== 'VALID_INVITE') {
      throw new UnauthorizedException('Invalid invite token');
    }

    const email = `resident+${Date.now()}@ochiga.com`; // generate resident email (or fetch from invite table)

    const user = this.userService.createUser({
      email,
      password,
      role: UserRole.RESIDENT,
    });

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
