// src/iot/entities/device.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { DeviceLog } from './device-log.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column({ default: false })
  isOn!: boolean;

  @Column('jsonb', { nullable: true })
  metadata!: Record<string, any>;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: 'CASCADE' })
  owner!: User;

  @OneToMany(() => DeviceLog, (log) => log.device, { cascade: true })
  logs!: DeviceLog[];

  @CreateDateColumn()
  createdAt!: Date;
}
