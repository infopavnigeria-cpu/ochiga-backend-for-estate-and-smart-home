import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Home } from '../homes/home.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., "Living Room", "Master Bedroom"

  @ManyToOne(() => Home, (home) => home.rooms, { onDelete: 'CASCADE' })
  home: Home;
}
