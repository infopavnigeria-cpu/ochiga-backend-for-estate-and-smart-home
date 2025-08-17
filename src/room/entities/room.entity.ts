import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Home } from '../../home/home.entity';  // ✅ use "home" not "homes"

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Home, (home) => home.rooms, { onDelete: 'CASCADE' })
  home!: Home;
}
