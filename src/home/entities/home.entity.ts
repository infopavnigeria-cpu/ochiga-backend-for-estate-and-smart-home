// src/home/entities/home.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Estate } from '../../estate/entities/estate.entity';
import { Room } from '../room/room.entity';
import { User } from '../../user/entities/user.entity';

@Entity('homes')
export class Home {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Estate, (estate) => estate.homes, { onDelete: 'CASCADE' })
  estate!: Estate;

  @OneToMany(() => Room, (room) => room.home, { cascade: true })
  rooms!: Room[];

  @ManyToOne(() => User, (user) => user.homes, { onDelete: 'SET NULL' })
  owner?: User;
}