// src/wallet/entities/transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // ✅ definite assignment assertion

  @Column({ type: 'enum', enum: ['fund', 'debit'] })
  type!: 'fund' | 'debit'; // ✅ fixed

  @Column('decimal', { precision: 12, scale: 2 })
  amount!: number; // ✅ fixed

  @Column({ type: 'text', nullable: true })
  description?: string; // ✅ optional field

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    onDelete: 'CASCADE',
  })
  wallet!: Wallet;

  @CreateDateColumn()
  createdAt!: Date;
}
