import { Controller, Post, Get, Patch, Delete, Param, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Body() dto: CreateRoomDto) {
    return this.roomService.create(req.user.id, dto);
  }

  @Get(':homeId')
  findByHome(@Req() req, @Param('homeId') homeId: string) {
    return this.roomService.findByHome(req.user.id, +homeId);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomService.update(req.user.id, +id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.roomService.remove(req.user.id, +id);
  }
}
