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
import { IotGateway } from './iot.gateway';
import { IotMqttService } from './iot.mqtt';

@Injectable()
export class IotService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepo: Repository<Device>,

    @InjectRepository(DeviceLog)
    private readonly logRepo: Repository<DeviceLog>,

    private readonly gateway: IotGateway,
    private readonly mqtt: IotMqttService,
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
      isOn: false,
    });

    const saved = await this.deviceRepo.save(device);

    // ✅ Notify via WebSocket & MQTT
    this.gateway.broadcast('deviceCreated', saved);
    this.mqtt.publishToggle(saved.id, saved.isOn);

    return saved;
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

    if (!device) throw new NotFoundException('Device not found');

    if (device.isEstateLevel && role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'Only managers can control estate-level devices',
      );
    }
    if (!device.isEstateLevel && (!device.owner || device.owner.id !== userId)) {
      throw new ForbiddenException('You can only control your own devices');
    }

    // ✅ Apply status
    device.isOn = dto.status;

    // ✅ Handle temperature if provided
    if (dto.temp !== undefined) {
      const metadata = device.metadata ? JSON.parse(device.metadata) : {};
      metadata.temp = dto.temp;
      device.metadata = JSON.stringify(metadata);
    }

    await this.deviceRepo.save(device);

    // ✅ Save log
    const log = this.logRepo.create({
      device: { id: device.id } as Device,
      action: dto.temp !== undefined ? 'set-temp' : dto.status ? 'on' : 'off',
      details:
        dto.temp !== undefined ? JSON.stringify(dto.temp) : String(dto.status),
    });
    await this.logRepo.save(log);

    const payload = {
      id: device.id,
      name: device.name,
      isOn: device.isOn,
      metadata: device.metadata ? JSON.parse(device.metadata) : {},
    };

    // ✅ Broadcast updates
    this.gateway.broadcast('deviceUpdated', payload);
    this.mqtt.publishToggle(device.id, device.isOn);

    return payload;
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
      order: { createdAt: 'DESC' },
    });
  }
}
