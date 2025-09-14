// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum'; // ✅ import the enum

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)   // ✅ enforce enum
  role?: UserRole;

  @IsOptional()
  @IsString()
  estate?: string;

  @IsOptional()
  @IsString()
  house?: string;
}
