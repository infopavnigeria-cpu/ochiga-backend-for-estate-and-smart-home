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

  // Store as string to avoid float precision issues
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance!: string;

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
