// src/rooms/room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Home } from '../homes/home.entity';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomsRepo: Repository<Room>,
    @InjectRepository(Home)
    private homesRepo: Repository<Home>,
  ) {}

  async createRoom(homeId: number, name: string) {
    const home = await this.homesRepo.findOne({ where: { id: homeId } });
    if (!home) {
      throw new NotFoundException(`Home with ID ${homeId} not found`);
    }
    const room = this.roomsRepo.create({ name, home });
    return this.roomsRepo.save(room);
  }

  async findAllByHome(homeId: number) {
    return this.roomsRepo.find({ where: { home: { id: homeId } } });
  }

  async update(id: number, dto: UpdateRoomDto) {
    const room = await this.roomsRepo.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    Object.assign(room, dto);
    return this.roomsRepo.save(room);
  }

  async remove(id: number) {
    const room = await this.roomsRepo.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return this.roomsRepo.remove(room);
  }
}
