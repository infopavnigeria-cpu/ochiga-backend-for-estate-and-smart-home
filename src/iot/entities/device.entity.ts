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
  id!: string; // ✅ Globally unique ID for each device

  @Column()
  name!: string; // e.g. "Living Room Light"

  @Column()
  type!: string; // e.g. "light", "thermostat", "camera"

  @Column({ default: false })
  isOn!: boolean; // ✅ current on/off state

  @Column({ default: false })
  isEstateLevel!: boolean; // ✅ true = shared across estate, not per-user

  /**
   * ✅ Metadata column
   * Automatically selects correct data type based on environment.
   * - Uses 'jsonb' if running on Postgres
   * - Uses 'simple-json' if SQLite (or fallback mode)
   */
  @Column({
    type: process.env.DB_TYPE?.toLowerCase().includes('post')
      ? 'jsonb'
      : 'simple-json',
    nullable: true,
  })
  metadata!: Record<string, any> | null;

  // ✅ Device belongs to a user (optional)
  @ManyToOne(() => User, (user) => user.devices, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  owner!: User | null;

  // ✅ Device can have many logs
  @OneToMany(() => DeviceLog, (log) => log.device, { cascade: true })
  logs!: DeviceLog[];

  @CreateDateColumn()
  createdAt!: Date; // ✅ Auto-set when created
}
