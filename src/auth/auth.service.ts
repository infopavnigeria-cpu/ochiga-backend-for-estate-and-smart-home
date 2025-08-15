import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // A simple array for a temporary in-memory database of users
  private users = []; 

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto) {
    const existingUser = this.users.find(user => user.email === registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const newUser = {
      id: this.users.length + 1,
      ...registerDto
    };
    this.users.push(newUser);

    const token = await this.generateToken(newUser);
    return { user: newUser, token };
  }

  async login(loginDto: LoginDto) {
    const user = this.users.find(user => user.email === loginDto.email);
    if (!user || user.password !== loginDto.password) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const token = await this.generateToken(user);
    return { user, token };
  }
  
  async logout(user: any) {
    // In a real app, you might invalidate a token or store it in a blocklist.
    // For this in-memory example, we'll just return a success message.
    return { message: 'Logout successful.' };
  }

  private async generateToken(user: any): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
