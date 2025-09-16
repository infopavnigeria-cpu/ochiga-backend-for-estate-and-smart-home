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
import { AuthResponseDto } from './dto/auth-response.dto'; // ✅ import new DTO

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

  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // ✅ Register
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = await this.userService.createUser({
        ...registerDto,
        password: hashedPassword,
        role: registerDto.role ?? UserRole.RESIDENT,
      });

      const token = this.generateJwt(user);
      return { user: this.sanitizeUser(user), token };
    } catch (err: unknown) {
      console.error('❌ AuthService.register error:', err);

      const error = err as { code?: string; message?: string };
      if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
        throw new BadRequestException('User already exists');
      }

      throw new InternalServerErrorException(
        error.message || 'Registration failed',
      );
    }
  }

  // ✅ Register Resident via Invite
  async registerResident(inviteToken: string, password: string): Promise<AuthResponseDto> {
    try {
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
      return { user: this.sanitizeUser(user), token };
    } catch (err: unknown) {
      console.error('❌ AuthService.registerResident error:', err);

      const error = err as { message?: string };
      throw new InternalServerErrorException(
        error.message || 'Resident registration failed',
      );
    }
  }

  // ✅ Login
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const user = await this.userService.findByEmail(loginDto.email);

      if (!user || !user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateJwt(user);
      return { user: this.sanitizeUser(user), token };
    } catch (err: unknown) {
      console.error('❌ AuthService.login error:', err);

      const error = err as { message?: string };
      throw new InternalServerErrorException(error.message || 'Login failed');
    }
  }
}
