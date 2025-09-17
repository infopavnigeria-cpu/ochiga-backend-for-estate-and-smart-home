// src/payments/entities/payment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

// same decimal transformer used for amounts
const decimalTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('decimal', { precision: 12, scale: 2, transformer: decimalTransformer })
  amount!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  provider!: string; // paystack/flutterwave etc.

  @Column({ default: 'NGN' })
  currency!: string;

  @Column({ unique: true })
  reference!: string;

  // ✅ Use TEXT instead of ENUM for SQLite compatibility
  @Column({ type: 'text', default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE', eager: true })
  user!: User;

  @ManyToOne(() => Wallet, (wallet) => wallet.payments, { onDelete: 'CASCADE', eager: true })
  wallet!: Wallet;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
