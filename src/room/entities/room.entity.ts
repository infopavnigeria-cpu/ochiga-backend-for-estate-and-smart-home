// src/room/entities/room.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Home } from '../../home/entities/home.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Home, (home) => home.rooms, { onDelete: 'CASCADE' })
  home!: Home;
}
