// src/rooms/room.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // ✅ Create a room under a specific home
  @Post(':homeId')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('homeId') homeId: string,
    @Body() dto: CreateRoomDto,
  ) {
    return this.roomService.createRoom(+homeId, dto.name);
  }

  // ✅ Get all rooms in a specific home
  @Get(':homeId')
  findByHome(@Param('homeId') homeId: string) {
    return this.roomService.findAllByHome(+homeId);
  }

  // ✅ Update room
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomService.update(+id, dto);
  }

  // ✅ Delete room
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
  remove(@Req() req, @Param('id') id: string) {
    return this.roomService.remove(req.user.id, +id);
  }
}
