// src/auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50) // prevent overly long names
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be MANAGER or RESIDENT' })
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  estate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  house?: string;
}
