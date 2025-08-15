import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { HomeService } from '../home/home.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private homeService: HomeService,
  ) {}

  async create(userId: number, createRoomDto: CreateRoomDto): Promise<Room> {
    // ✅ Validate that the home belongs to the user
    await this.homeService.findOne(userId, createRoomDto.homeId);

    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  async findAll(userId: number): Promise<Room[]> {
    // ✅ Find all rooms for homes owned by user
    return this.roomRepository.find({
      where: { home: { userId } },
      relations: ['home'],
    });
  }

  async findOne(userId: number, id: number): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['home'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // ✅ Ownership check
    await this.homeService.findOne(userId, room.home.id);

    return room;
  }

  async update(userId: number, id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(userId, id);
    Object.assign(room, updateRoomDto);
    return this.roomRepository.save(room);
  }

  async remove(userId: number, id: number): Promise<void> {
    const room = await this.findOne(userId, id);
    await this.roomRepository.remove(room);
  }
}
