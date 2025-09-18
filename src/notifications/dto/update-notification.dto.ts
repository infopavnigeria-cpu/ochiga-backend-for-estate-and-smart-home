// src/notifications/dto/update-notification.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  // we inherit all fields, but make them optional for updating
}
