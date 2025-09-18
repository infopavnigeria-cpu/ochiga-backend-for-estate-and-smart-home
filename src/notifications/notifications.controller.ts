import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.service.create(userId, dto);
  }

  @Get(':userId')
  findForUser(@Param('userId') userId: string) {
    return this.service.findForUser(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }
}
