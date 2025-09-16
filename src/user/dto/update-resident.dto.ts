import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateResidentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  estate?: string;

  @IsOptional()
  @IsString()
  house?: string;
}
