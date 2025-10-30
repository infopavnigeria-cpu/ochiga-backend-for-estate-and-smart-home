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

// 🩹 Force-load DB type safely
const dbType = (process.env.DB_TYPE || 'sqlite').toLowerCase();

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column({ default: false })
  isOn!: boolean;

  @Column({ default: false })
  isEstateLevel!: boolean;

  // ✅ Safe JSON type switch
  @Column({
    type: dbType.includes('post') ? 'jsonb' : 'simple-json',
    nullable: true,
  })
  metadata!: Record<string, any> | null;

  @ManyToOne(() => User, (user) => user.devices, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  owner!: User | null;

  @OneToMany(() => DeviceLog, (log) => log.device, { cascade: true })
  logs!: DeviceLog[];

  @CreateDateColumn()
  createdAt!: Date;
}
