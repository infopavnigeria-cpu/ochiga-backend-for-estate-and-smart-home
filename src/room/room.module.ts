import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { HomeModule } from '../home/home.module';

@Module({
  imports: [HomeModule],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
