import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Room } from '../../room/entities/room.entity';

@Entity()
export class Home {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // ✅ Add this relation so each home can have many rooms
  @OneToMany(() => Room, room => room.home, { cascade: true })
  rooms: Room[];
}
