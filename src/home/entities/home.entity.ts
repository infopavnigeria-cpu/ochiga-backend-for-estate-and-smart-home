// src/home/entities/home.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Estate } from '../../estate/entities/estate.entity';
import { Room } from '../../room/entities/room.entity';
import { HomeMember } from './home-member.entity';

@Entity('homes')
export class Home {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  // optional address field or link to estate:
  @Column({ nullable: true })
  address?: string;

  @ManyToOne(() => Estate, (estate) => estate.homes, { onDelete: 'CASCADE', nullable: true })
  estate?: Estate;

  @OneToMany(() => Room, (room) => room.home, { cascade: true })
  rooms!: Room[];

  @OneToMany(() => HomeMember, (member) => member.home, { cascade: true })
  members!: HomeMember[];
}
