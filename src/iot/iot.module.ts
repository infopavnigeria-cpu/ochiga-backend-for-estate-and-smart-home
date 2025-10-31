import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotService } from './iot.service';
import { IotGateway } from './iot.gateway';
import { IotMqttService } from './iot.mqtt';
import { IotController } from './iot.controller';
import { Device } from './entities/device.entity';
import { DeviceLog } from './entities/device-log.entity';
import { AiModule } from '../ai/ai.module'; // 👈 added

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, DeviceLog]),
    AiModule, // 👈 added this line
  ],
  providers: [IotService, IotGateway, IotMqttService],
  controllers: [IotController],
})
export class IotModule {}
