// src/user/dto/create-resident.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateResidentDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  estate!: string;

  @IsNotEmpty()
  house!: string;
}
