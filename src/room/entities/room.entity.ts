import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Home } from '../../home/entities/home.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Home, (home) => home.rooms)
  home: Home;
}
