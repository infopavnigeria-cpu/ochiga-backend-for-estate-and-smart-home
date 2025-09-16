import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  amount!: string;

  @Column({
    type: 'enum',
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid',
  })
  status!: 'Paid' | 'Unpaid';
}
