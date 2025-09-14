// src/user/dto/register-resident.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterResidentDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  estate!: string;

  @IsNotEmpty()
  @IsString()
  house!: string;
}
