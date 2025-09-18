// src/iot/entities/device.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DeviceLog } from './device-log.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string; // e.g. "Living Room Light" or "Main Gate"

  @Column()
  type!: string; // e.g. "light", "gate", "camera"

  @Column({ default: false })
  isOn!: boolean;

  // ✅ Reverted: store as plain string
  @Column({ nullable: true })
  metadata!: string; // JSON string, manual parse/stringify in service

  @ManyToOne(() => User, (user: User) => user.devices, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  owner?: User;

  @OneToMany(() => DeviceLog, (log) => log.device, { cascade: true })
  logs!: DeviceLog[];

  @Column({ default: false })
  isEstateLevel!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
