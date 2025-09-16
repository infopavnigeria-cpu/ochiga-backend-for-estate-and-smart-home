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

  @ManyToOne(() => User, (user) => user.wallet, { eager: true })
  user!: User;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: 'varchar', length: 10, default: 'NGN' })
  currency!: string;

  @Column({ default: true })
  isActive!: boolean;

  // 🔥 Add this relation so wallet.payments exists
  @OneToMany(() => Payment, (payment) => payment.wallet)
  payments!: Payment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
