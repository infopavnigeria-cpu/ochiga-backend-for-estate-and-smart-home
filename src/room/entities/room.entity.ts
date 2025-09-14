// src/room/entities/room.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Home } from '../../home/entities/home.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')  // ✅ switched to UUID
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Home, (home: Home) => home.rooms, { onDelete: 'CASCADE' })
  home!: Home;
}
