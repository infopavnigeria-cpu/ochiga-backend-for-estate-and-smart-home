// src/user/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  // ✅ One-to-one link to Wallet
  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet!: Wallet;

  // ✅ One-to-many link to Payments
  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];
}
