import { IsString, IsIn } from 'class-validator';

export class NotificationDto {
  @IsString()
  deviceId!: string;

  @IsString()
  message!: string;

  @IsIn(['info', 'warning', 'critical'])
  severity!: 'info' | 'warning' | 'critical';
}
