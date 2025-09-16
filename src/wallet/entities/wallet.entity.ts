// src/wallet/entities/wallet.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Every wallet belongs to one resident (user)
  @ManyToOne(() => User, (user) => user.wallets, { eager: true })
  user: User;

  // Wallet balance starts at 0
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  // Mark wallet active/inactive
  @Column({ default: true })
  isActive: boolean;

  // Auto timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
