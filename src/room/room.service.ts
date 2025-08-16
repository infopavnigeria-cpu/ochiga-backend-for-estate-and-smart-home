import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Home } from '../homes/home.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepo: Repository<Room>,
    @InjectRepository(Home)
    private homesRepo: Repository<Home>,
  ) {}

  async createRoom(homeId: number, name: string) {
    const home = await this.homesRepo.findOne({ where: { id: homeId } });
    const room = this.roomsRepo.create({ name, home });
    return this.roomsRepo.save(room);
  }

  async findAllByHome(homeId: number) {
    return this.roomsRepo.find({ where: { home: { id: homeId } } });
  }
}
