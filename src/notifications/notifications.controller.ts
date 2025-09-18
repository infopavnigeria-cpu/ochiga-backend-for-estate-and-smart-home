// src/notifications/notifications.controller.ts
import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  // ✅ Create a new notification for a user
  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.service.create(userId, dto);
  }

  // ✅ Get all notifications for a user
  @Get(':userId')
  findForUser(@Param('userId') userId: string) {
    return this.service.findForUser(userId);
  }

  // ✅ Mark one notification as read
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }

  // ✅ (Optional) Update a notification (e.g. type, message)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationDto,
  ) {
    return this.service.update(id, dto);
  }
}
