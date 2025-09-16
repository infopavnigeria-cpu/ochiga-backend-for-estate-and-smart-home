import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  amount: string; // you can use string for ₦ formatting or number if you’ll calculate

  @Column({ default: 'Unpaid' })
  status: 'Paid' | 'Unpaid';
}
