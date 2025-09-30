import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class RegisterDeviceDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  type!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
