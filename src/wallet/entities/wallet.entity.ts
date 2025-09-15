import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ✅ Relation to User
  @OneToOne(() => User, (user) => user.wallet, { eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;   // ✅ keep foreign key explicitly

  // ✅ store as integer (kobo/cent) for accuracy
  @Column({ type: 'integer', default: 0 })
  balance!: number;

  @Column({ nullable: true })
  currency?: string; // NGN, USD, etc.

  @Column({ default: false })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
