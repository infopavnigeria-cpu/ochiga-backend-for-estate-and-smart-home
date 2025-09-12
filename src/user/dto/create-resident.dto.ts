// src/user/dto/create-resident.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateResidentDto {
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
