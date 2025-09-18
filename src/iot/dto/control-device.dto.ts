import { IsString, IsOptional, IsIn } from 'class-validator';

export class ControlDeviceDto {
  @IsString()
  @IsIn(['on', 'off', 'set-temp'])
  action!: string;   // "on", "off", "set-temp"

  @IsOptional()
  value?: any;
}
