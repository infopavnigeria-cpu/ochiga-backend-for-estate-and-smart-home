import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('maintenance_requests')
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  issue: string;

  @Column({ default: 'Pending' })
  status: 'Pending' | 'Resolved';
}
