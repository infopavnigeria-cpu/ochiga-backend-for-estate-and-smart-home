import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Maintenance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  issue!: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Resolved'],
    default: 'Pending',
  })
  status!: 'Pending' | 'Resolved';
}
