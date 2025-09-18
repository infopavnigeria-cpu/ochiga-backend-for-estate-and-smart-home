import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;  // e.g. "Living Room Light" or "Main Gate"

  @Column()
  type!: string;  // e.g. "light", "gate", "camera"

  @Column({ default: false })
  isOn!: boolean;

  @Column({ nullable: true })
  metadata!: string; // JSON config

  @ManyToOne(() => User, (user) => user.devices, { nullable: true, onDelete: 'CASCADE' })
  owner?: User; // null if estate-level device

  @Column({ default: false })
  isEstateLevel!: boolean; // true = shared infrastructure

  @CreateDateColumn()
  createdAt!: Date;
}
