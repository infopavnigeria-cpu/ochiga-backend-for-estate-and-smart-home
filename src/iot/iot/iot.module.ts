import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';
import { Device } from './entities/device.entity';
import { DeviceLog } from './entities/device-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, DeviceLog])],
  controllers: [IotController],
  providers: [IotService],
  exports: [IotService], // in case we need it elsewhere
})
export class IotModule {}
