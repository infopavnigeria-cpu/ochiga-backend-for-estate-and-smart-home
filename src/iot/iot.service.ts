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
import { CreateDeviceDto } from './dto/create-device.dto';
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

  async findUserDevices(userId: string) {
    return this.deviceRepo.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
  }

  async findEstateDevices() {
    return this.deviceRepo.find({
      where: { isEstateLevel: true },
    });
  }

  async createDevice(userId: string, role: UserRole, dto: CreateDeviceDto) {
    if (dto.isEstateLevel && role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'Only managers can create estate-level devices',
      );
    }

    const device = this.deviceRepo.create({
      ...dto,
      owner: dto.isEstateLevel ? null : ({ id: userId } as any),
    });

    return this.deviceRepo.save(device);
  }

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

    if (device.isEstateLevel && role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'Only managers can control estate-level devices',
      );
    }
    if (!device.isEstateLevel && (!device.owner || device.owner.id !== userId)) {
      throw new ForbiddenException('You can only control your own devices');
    }

    if (dto.action === 'on') device.isOn = true;
    if (dto.action === 'off') device.isOn = false;
    if (dto.action === 'set-temp') {
      const metadata = device.metadata ? JSON.parse(device.metadata) : {};
      metadata.temp = dto.value;
      device.metadata = JSON.stringify(metadata);
    }

    await this.deviceRepo.save(device);

    const log = this.logRepo.create({
      device: { id: device.id } as Device,
      action: dto.action,
      details: dto.value !== undefined ? JSON.stringify(dto.value) : undefined,
    });
    await this.logRepo.save(log);

    return {
      id: device.id,
      name: device.name,
      isOn: device.isOn,
      metadata: device.metadata ? JSON.parse(device.metadata) : {},
    };
  }

  async getDeviceLogs(userId: string, role: UserRole, deviceId: string) {
    const device = await this.deviceRepo.findOne({
      where: { id: deviceId },
      relations: ['owner'],
    });

    if (!device) throw new NotFoundException('Device not found');

    if (device.isEstateLevel && role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'Only managers can view estate-level device logs',
      );
    }
    if (!device.isEstateLevel && (!device.owner || device.owner.id !== userId)) {
      throw new ForbiddenException('You can only view your own device logs');
    }

    return this.logRepo.find({
      where: { device: { id: deviceId } },
      order: { createdAt: 'DESC' }, // ✅ fixed (was "timestamp")
    });
  }
}
