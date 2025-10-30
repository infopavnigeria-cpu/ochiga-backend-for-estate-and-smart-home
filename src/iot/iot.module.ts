import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';
import { IotGateway } from './iot.gateway';
import { IotMqttService } from './iot.mqtt';
import { Device } from './entities/device.entity';
import { DeviceLog } from './entities/device-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceLog])],
  controllers: [IotController],
  providers: [IotService, IotGateway, IotMqttService],
  exports: [IotService],
})
export class IotModule {}
