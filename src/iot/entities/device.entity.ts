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
  id!: string; // ✅ UUID ensures globally unique IDs across estates/devices

  @Column()
  name!: string; // e.g. "Living Room Light"

  @Column()
  type!: string; // e.g. "light", "thermostat", "camera"

  @Column({ default: false })
  isOn!: boolean; // ✅ quick toggle state

  @Column({ default: false })
  isEstateLevel!: boolean; // ✅ true = device belongs to estate, not a single user

  // ✅ Metadata: stores flexible configs per device
  // - SQLite uses "simple-json" (JSON stored as TEXT)
  // - Postgres uses "jsonb" (queryable JSON)
  @Column({
    type: process.env.DB_TYPE === 'postgres' ? 'jsonb' : 'simple-json',
    nullable: true,
  })
  metadata!: Record<string, any> | null;

  // ✅ Relation: a device may belong to a user (or null if estate-level)
  @ManyToOne(() => User, (user) => user.devices, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  owner!: User | null;

  // ✅ Logs: one device can have many log entries (history of actions/events)
  @OneToMany(() => DeviceLog, (log) => log.device, { cascade: true })
  logs!: DeviceLog[];

  @CreateDateColumn()
  createdAt!: Date; // ✅ auto-set when device is created
}
