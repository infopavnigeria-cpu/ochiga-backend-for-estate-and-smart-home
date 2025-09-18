// src/iot/entities/device-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Device } from './device.entity';

@Entity()
export class DeviceLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Device, (device) => device.logs, { onDelete: 'CASCADE' })
  device!: Device;

  @Column()
  action!: string; // "on", "off", "set-temp"

  @Column({ nullable: true })
  details?: string; // extra info e.g. temp=22

  @CreateDateColumn()
  createdAt!: Date;
}
