import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Home } from '../home/entities/home.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepo: Repository<Room>,

    @InjectRepository(Home)
    private readonly homesRepo: Repository<Home>,
  ) {}

  async createRoom(homeId: string, name: string) {   // 👈 use string
    const home = await this.homesRepo.findOne({ where: { id: homeId } });
    if (!home) throw new NotFoundException('Home not found');

    const room = this.roomsRepo.create({ name, home });
    return this.roomsRepo.save(room);
  }

  async findAllByHome(homeId: string) {   // 👈 use string
    return this.roomsRepo.find({
      where: { home: { id: homeId } },
      relations: ['home'],
    });
  }
}
