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

// ✅ Force fallback if DB_TYPE not loaded early enough
if (!process.env.DB_TYPE) {
  process.env.DB_TYPE = 'sqlite';
}

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

  // ✅ 100% safe JSON column type selection
  @Column({
    type:
      process.env.DB_TYPE &&
      process.env.DB_TYPE.toLowerCase().includes('post')
        ? 'jsonb'
        : 'simple-json',
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
