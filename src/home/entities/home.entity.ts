import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Estate } from '../estate/estate.entity';
import { Room } from '../room/room.entity';

@Entity()
export class Home {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Estate, (estate) => estate.homes, { onDelete: 'CASCADE' })
  estate!: Estate;

  @OneToMany(() => Room, (room) => room.home, { cascade: true })
  rooms!: Room[];
}