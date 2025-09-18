// src/notifications/dto/create-notification.dto.ts
import { IsString, IsNotEmpty, IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  type!: string; // must be "VISITOR", "PAYMENT", "DEVICE", or "SYSTEM"

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsUUID()
  @IsNotEmpty()
  userId!: string; // the user receiving the notification

  @IsOptional()
  @IsBoolean()
  isRead?: boolean; // default false if not provided
}
