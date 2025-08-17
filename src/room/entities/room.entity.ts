import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Home } from '../../homes/home.entity';  // ✅ fixed path

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;  // ✅ fixed with "!"

  @Column()
  name!: string;  // ✅ fixed with "!"

  @ManyToOne(() => Home, (home) => home.rooms, { onDelete: 'CASCADE' })
  home!: Home;  // ✅ fixed type
}
