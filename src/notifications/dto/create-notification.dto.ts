// src/notifications/dto/create-notification.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsUUID()
  @IsNotEmpty()
  userId!: string; // which user this notification belongs to

  @IsOptional()
  @IsString()
  type?: string; // e.g. "payment", "visitor", "device", etc.
}
