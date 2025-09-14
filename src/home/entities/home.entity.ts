// src/home/entities/home.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Estate } from '../../estate/entities/estate.entity';
import { Room } from '../../room/entities/room.entity';
import { HomeMember } from './home-member.entity';

@Entity()
export class Home {
  @PrimaryGeneratedColumn('uuid')   // ✅ switched to UUID
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Estate, (estate) => estate.homes, { onDelete: 'CASCADE' })
  estate!: Estate;

  @OneToMany(() => Room, (room) => room.home, { cascade: true })
  rooms!: Room[];

  @OneToMany(() => HomeMember, (member) => member.home, { cascade: true })
  members!: HomeMember[];
}
