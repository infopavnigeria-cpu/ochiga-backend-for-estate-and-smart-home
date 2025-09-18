// src/iot/iot.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { ControlDeviceDto } from './dto/control-device.dto';
import { Device } from './entities/device.entity';
import { DeviceLog } from './entities/device-log.entity';

@Injectable()
export class IotService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,

    @InjectRepository(DeviceLog)
    private readonly logRepo: Repository<DeviceLog>,
  ) {}

  async controlDevice(
    userId: string,
    role: UserRole,
    deviceId: string,
    dto: ControlDeviceDto,
  ) {
    const device = await this.deviceRepo.findOne({
      where: { id: deviceId },
      relations: ['owner'],
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    // 🔒 Security checks
    if (device.isEstateLevel && role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'Only managers can control estate-level devices',
      );
    }
    if (!device.isEstateLevel && (!device.owner || device.owner.id !== userId)) {
      throw new ForbiddenException(
        'You can only control your own devices',
      );
    }

    // ✅ Apply control
    if (dto.action === 'on') device.isOn = true;
    if (dto.action === 'off') device.isOn = false;
    if (dto.action === 'set-temp') {
      const metadata = device.metadata ? JSON.parse(device.metadata) : {};
      metadata.temp = dto.value;
      device.metadata = JSON.stringify(metadata);
    }

    await this.deviceRepo.save(device);

    // 📜 Save log
    const log = this.logRepo.create({
      device,
      action: dto.action,
      details: dto.value ? JSON.stringify(dto.value) : null,
    });
    await this.logRepo.save(log);

    // 🎯 Return safe response
    return {
      id: device.id,
      name: device.name,
      isOn: device.isOn,
      metadata: device.metadata ? JSON.parse(device.metadata) : {},
    };
  }
}
