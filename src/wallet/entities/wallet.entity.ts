// src/wallet/entities/wallet.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance!: number;

  @Column({ default: 'NGN' })
  currency!: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToOne(() => User, (user) => user.wallet, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @OneToMany(() => Payment, (payment) => payment.wallet)
  payments!: Payment[];
}
