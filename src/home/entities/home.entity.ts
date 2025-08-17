import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Estate } from '../estate/estate.entity';
import { Room } from '../room/room.entity';

@Entity()
export class Home {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., "Ochiga Villa", "Apartment 12B"

  @ManyToOne(() => User, (user) => user.homes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Estate, (estate) => estate.homes, { onDelete: 'CASCADE' })
  estate: Estate;

  @OneToMany(() => Room, (room) => room.home)
  rooms: Room[];
}
