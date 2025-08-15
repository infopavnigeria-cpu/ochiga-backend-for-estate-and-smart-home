import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(name: string, homeId: number) {
    const room = this.roomRepository.create({ name, home: { id: homeId } as any });
    return this.roomRepository.save(room);
  }

  async findAll(userId: number) {
    return this.roomRepository.find({
      relations: ['home'],
      where: { home: { userId } }, // ✅ Works now because Home has userId
    });
  }
}
