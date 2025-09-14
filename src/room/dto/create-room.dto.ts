// src/room/dto/create-room.dto.ts
import { IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name!: string;

  @IsString()
  homeId!: string;  // 👈 change number → string
}
