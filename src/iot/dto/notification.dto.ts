// src/iot/dto/notification.dto.ts
export class NotificationDto {
  deviceId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}
