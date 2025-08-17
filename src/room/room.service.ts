import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';   // ✅ FIXED PATH
import { Home } from '../home/entities/home.entity'; // ✅ FIXED PATH

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepo: Repository<Room>,

    @InjectRepository(Home)
    private readonly homesRepo: Repository<Home>,
  ) {}

  async createRoom(homeId: number, name: string) {
    const home = await this.homesRepo.findOne({ where: { id: homeId } });
    if (!home) throw new Error('Home not found');

    const room = this.roomsRepo.create({ name, home });
    return this.roomsRepo.save(room);
  }

  async findAllByHome(homeId: number) {
    return this.roomsRepo.find({
      where: { home: { id: homeId } },
      relations: ['home'],
    });
  }
}
