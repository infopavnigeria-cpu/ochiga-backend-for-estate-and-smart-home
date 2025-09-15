import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // 💰 Balance in NGN by default
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 'NGN' })
  currency!: string;

  /** -------- Relations -------- **/

  // 👤 Each wallet belongs to ONE user
  @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  user!: User;

  // 💳 A wallet can have many payments
  @OneToMany(() => Payment, (payment) => payment.wallet)
  payments!: Payment[];

  /** -------- Timestamps -------- **/
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
