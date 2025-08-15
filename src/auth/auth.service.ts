// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './types'; // <-- Add this import

@Injectable()
export class AuthService {
  private users: User[] = [];
  // ... rest of your code
}
