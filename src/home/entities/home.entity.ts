import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Room } from '../../room/entities/room.entity';

@Entity()
export class Home {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // ✅ Add this so we can filter rooms by the user who owns the home
  @Column()
  userId: number;

  @OneToMany(() => Room, (room) => room.home)
  rooms: Room[];
}
