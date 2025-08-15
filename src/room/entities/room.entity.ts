import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Home } from '../../home/entities/home.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // ✅ Relation to Home
  @ManyToOne(() => Home, home => home.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homeId' }) // Makes sure the column name is 'homeId'
  home: Home;

  // ✅ Direct foreign key column for quick access
  @Column()
  homeId: number;
}
