// src/wallet/entities/transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  ValueTransformer,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from '../../user/entities/user.entity';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

const decimalTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 10 })
  type!: TransactionType;

  @Column('decimal', { precision: 12, scale: 2, transformer: decimalTransformer })
  amount!: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.payments, { onDelete: 'CASCADE' })
  wallet!: Wallet;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
