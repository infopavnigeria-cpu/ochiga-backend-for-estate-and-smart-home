import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async create(userId: string, dto: CreateNotificationDto) {
    const notif = this.notificationsRepo.create({
      ...dto,
      user: { id: userId } as any,
    });
    return this.notificationsRepo.save(notif);
  }

  async findForUser(userId: string) {
    return this.notificationsRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string) {
    await this.notificationsRepo.update(id, { isRead: true });
    return { success: true };
  }

  async update(id: string, dto: UpdateNotificationDto) {
    const notif = await this.notificationsRepo.findOne({ where: { id } });
    if (!notif) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    Object.assign(notif, dto);
    return this.notificationsRepo.save(notif);
  }

  async remove(id: string) {
    const notif = await this.notificationsRepo.findOne({ where: { id } });
    if (!notif) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    await this.notificationsRepo.remove(notif);
    return { success: true };
  }
}
