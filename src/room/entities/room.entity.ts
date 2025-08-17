import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Home } from '../../homes/home.entity'; // ✅ correct path

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;   // definite assignment since TypeORM will set this

  @Column()
  name!: string;  // same here

  @ManyToOne(() => Home, (home) => home.rooms, { onDelete: 'CASCADE' })
  home!: Home;
}
