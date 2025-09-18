// src/iot/entities/device.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity'; // ✅ fixed path (no extra "s")
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

  @Column({ nullable: true })
  metadata!: string; // JSON config (stringified)

  @ManyToOne(() => User, (user: User) => user.devices, { // ✅ added type
    nullable: true,
    onDelete: 'CASCADE',
  })
  owner?: User; // null if estate-level device

  @OneToMany(() => DeviceLog, (log) => log.device, { cascade: true })
  logs!: DeviceLog[];

  @Column({ default: false })
  isEstateLevel!: boolean; // true = shared infrastructure

  @CreateDateColumn()
  createdAt!: Date;
}
