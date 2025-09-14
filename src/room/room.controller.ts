import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Create a new room under a home
  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto.homeId, createRoomDto.name);
  }

  // Get all rooms under a specific home
  @Get('home/:homeId')
  async findAllByHome(@Param('homeId') homeId: string) {  // 👈 use string not number
    return this.roomService.findAllByHome(homeId);
  }
}
