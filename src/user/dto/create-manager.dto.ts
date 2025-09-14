// src/user/dto/create-manager.dto.ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateManagerDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
