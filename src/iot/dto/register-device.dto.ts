import { IsString, IsOptional } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsOptional()
  metadata?: any;
}
