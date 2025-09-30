import { IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class ControlDeviceDto {
  @IsBoolean()
  status!: boolean;   // true = ON, false = OFF

  @IsOptional()
  @IsNumber()
  temp?: number;      // optional, for set-temp
}
