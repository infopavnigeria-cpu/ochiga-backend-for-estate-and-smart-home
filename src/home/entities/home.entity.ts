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
import { User } from '../../user/entities/user.entity'; // 👈 add this

@Entity('homes') // 👈 name your table
export class Home {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  // Relation → Estate
  @ManyToOne(() => Estate, (estate) => estate.homes, { onDelete: 'CASCADE' })
  estate!: Estate;

  // Relation → Rooms
  @OneToMany(() => Room, (room) => room.home, { cascade: true })
  rooms!: Room[];

  // Relation → User (owner)
  @ManyToOne(() => User, (user) => user.homes, { onDelete: 'SET NULL' })
  owner?: User;
}