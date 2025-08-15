import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import { HomeService } from '../home/home.service';

@Injectable()
export class RoomService {
  private rooms: Room[] = [];
  private idCounter = 1;

  constructor(private readonly homeService: HomeService) {}

  create(userId: number, dto: CreateRoomDto): Room {
    const home = this.homeService.findOne(userId, dto.homeId); // validates ownership
    const room: Room = {
      id: this.idCounter++,
      name: dto.name,
      homeId: home.id
    };
    this.rooms.push(room);
    return room;
  }

  findByHome(userId: number, homeId: number): Room[] {
    this.homeService.findOne(userId, homeId); // validates ownership
    return this.rooms.filter(room => room.homeId === homeId);
  }

  update(userId: number, id: number, dto: UpdateRoomDto): Room {
    const room = this.rooms.find(r => r.id === id);
    if (!room) throw new NotFoundException('Room not found');
    this.homeService.findOne(userId, room.homeId); // validates ownership
    Object.assign(room, dto);
    return room;
  }

  remove(userId: number, id: number): void {
    const index = this.rooms.findIndex(r => r.id === id);
    if (index === -1) throw new NotFoundException('Room not found');
    this.homeService.findOne(userId, this.rooms[index].homeId); // validates ownership
    this.rooms.splice(index, 1);
  }
}
