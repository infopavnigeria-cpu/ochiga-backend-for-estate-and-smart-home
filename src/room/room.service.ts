// src/rooms/room.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';
import { Home } from '../homes/home.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,

    @InjectRepository(Home)
    private readonly homeRepo: Repository<Home>,
  ) {}

  // ✅ Create a room under a specific home
  async createRoom(homeId: number, name: string): Promise<Room> {
    const home = await this.homeRepo.findOne({ where: { id: homeId } });
    if (!home) {
      throw new NotFoundException(`Home with ID ${homeId} not found`);
    }

    const room = this.roomRepo.create({ name, home });
    return this.roomRepo.save(room);
  }

  // ✅ Get all rooms for a home
  async findAllByHome(homeId: number): Promise<Room[]> {
    return this.roomRepo.find({
      where: { home: { id: homeId } },
      relations: ['home'], // includes home details in response
    });
  }

  // ✅ Find single room
  async findOne(id: number): Promise<Room> {
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: ['home'],
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  // ✅ Delete room
  async remove(id: number): Promise<void> {
    const result = await this.roomRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
  }
}
