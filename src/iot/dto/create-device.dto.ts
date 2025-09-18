// src/iot/dto/create-device.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsOptional()
  @IsBoolean()
  isEstateLevel?: boolean;
}
