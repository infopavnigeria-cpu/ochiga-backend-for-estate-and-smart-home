import { IsEmail, IsNotEmpty, IsOptional, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

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
