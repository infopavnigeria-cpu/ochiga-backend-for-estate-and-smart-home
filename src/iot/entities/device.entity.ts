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
  @PrimaryGeneratedColumn('uuid')
  id!: string; // ✅ using uuid since service expects string ids

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column({ default: false })
  isOn!: boolean;

  // 👇 Needed for estate-level devices
  @Column({ default: false })
  isEstateLevel!: boolean;

  @Column('jsonb', { nullable: true })
  metadata!: Record<string, any>;

  @ManyToOne(() => User, (user) => user.devices, {
    onDelete: 'CASCADE',
    nullable: true, // ✅ estate-level devices may not have an owner
  })
  owner!: User | null;

  @OneToMany(() => DeviceLog, (log) => log.device, { cascade: true })
  logs!: DeviceLog[];

  @CreateDateColumn()
  createdAt!: Date;
}
