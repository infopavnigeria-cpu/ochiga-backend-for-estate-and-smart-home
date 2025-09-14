// src/user/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class CreateUserDto {
  @IsOptional()   // ✅ no longer required at invite stage
  @IsString()
  name?: string;

  @IsEmail()
  email!: string;

  @IsOptional()   // ✅ allow empty at invite stage
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  estate?: string;

  @IsOptional()
  @IsString()
  house?: string;
}
