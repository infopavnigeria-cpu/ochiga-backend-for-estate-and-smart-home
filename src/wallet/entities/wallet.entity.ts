import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Balance is stored as DECIMAL in DB, but handled as number in code
  @Column('decimal', {
    precision: 12,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value, // JS → DB
      from: (value: string) => parseFloat(value), // DB → JS
    },
  })
  balance!: number;

  @Column({ default: 'NGN' })
  currency!: string;

  // A user has exactly one wallet
  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  // A wallet can have many payments
  @OneToMany(() => Payment, (payment) => payment.wallet)
  payments!: Payment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
