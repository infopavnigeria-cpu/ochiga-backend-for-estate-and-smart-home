// src/iot/entities/device.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  type!: string; // e.g., "light", "thermostat"

  @Column({ default: false })
  status!: boolean;

  // 👇 Add this relation to fix "owner not found"
  @ManyToOne(() => User, (user) => user.devices, {
    onDelete: 'CASCADE',
  })
  owner!: User;
}
