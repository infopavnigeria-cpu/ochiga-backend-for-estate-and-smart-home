import {
  Injectable, ForbiddenException, NotFoundException, BadRequestException,
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
    @InjectRepository(Device) private readonly deviceRepo: Repository<Device>,
    @InjectRepository(DeviceLog) private readonly logRepo: Repository<DeviceLog>,
    private readonly gateway: IotGateway,
    private readonly mqtt: IotMqttService,
  ) {}

  async findUserDevices(userId: string) {
    return this.deviceRepo.find({ where: { owner: { id: userId } }, relations: ['owner'] });
  }

  async findEstateDevices() {
    return this.deviceRepo.find({ where: { isEstateLevel: true } });
  }

  async createDevice(userId: string, role: UserRole, dto: CreateDeviceDto) {
    if (dto.isEstateLevel && role !== UserRole.MANAGER)
      throw new ForbiddenException('Only managers can create estate-level devices');

    const device = this.deviceRepo.create({
      ...dto,
      owner: dto.isEstateLevel ? null : ({ id: userId } as any),
      isOn: false,
      metadata: {},
    });

    const saved = await this.deviceRepo.save(device);
    this.gateway.broadcast('deviceCreated', saved);
    this.mqtt.publishToggle(saved.id.toString(), saved.isOn);

    return saved;
  }

  async controlDevice(userId: string, role: UserRole, deviceId: string, dto: ControlDeviceDto) {
    const device = await this.deviceRepo.findOne({ where: { id: deviceId as any }, relations: ['owner'] });
    if (!device) throw new NotFoundException('Device not found');

    if (device.isEstateLevel && role !== UserRole.MANAGER)
      throw new ForbiddenException('Only managers can control estate-level devices');
    if (!device.isEstateLevel && (!device.owner || device.owner.id !== userId))
      throw new ForbiddenException('You can only control your own devices');

    const metadata: Record<string, any> = device.metadata || {};

    switch (dto.action) {
      case 'on': device.isOn = true; break;
      case 'off': device.isOn = false; break;
      case 'set-temp': metadata.temp = dto.value; break;
      case 'set-brightness': metadata.brightness = dto.value; break;
      case 'set-speed': metadata.speed = dto.value; break;
      case 'set-mode': metadata.mode = dto.mode ?? dto.value; break;
      case 'custom': Object.assign(metadata, dto.payload); break;
      default: throw new BadRequestException(`Unsupported action: ${dto.action}`);
    }

    device.metadata = metadata;
    await this.deviceRepo.save(device);

    await this.logRepo.save(this.logRepo.create({
      device: { id: device.id } as Device,
      action: dto.action,
      details: JSON.stringify({
        value: dto.value,
        payload: dto.payload,
        timestamp: new Date().toISOString(),
      }),
    }));

    const payload = { id: device.id, name: device.name, isOn: device.isOn, metadata };
    this.gateway.broadcast('deviceUpdated', payload);
    this.mqtt.publishToggle(device.id.toString(), device.isOn);
    this.mqtt.publishMetadata(device.id.toString(), metadata);
    return payload;
  }

  async getDeviceLogs(userId: string, role: UserRole, deviceId: string) {
    const device = await this.deviceRepo.findOne({ where: { id: deviceId as any }, relations: ['owner'] });
    if (!device) throw new NotFoundException('Device not found');
    if (device.isEstateLevel && role !== UserRole.MANAGER)
      throw new ForbiddenException('Only managers can view estate-level device logs');
    if (!device.isEstateLevel && (!device.owner || device.owner.id !== userId))
      throw new ForbiddenException('You can only view your own device logs');

    return this.logRepo.find({ where: { device: { id: deviceId } }, order: { createdAt: 'DESC' } });
  }
}
