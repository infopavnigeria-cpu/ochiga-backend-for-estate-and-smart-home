// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  role?: 'manager' | 'resident';

  @IsOptional()
  estate?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  house?: string;
}
