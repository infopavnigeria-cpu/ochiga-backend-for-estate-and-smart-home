// src/room/room.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto.homeId, createRoomDto.name);
  }

  @Get('home/:homeId')
  async findAllByHome(@Param('homeId') homeId: string) {
    return this.roomService.findAllByHome(homeId);
  }
}
