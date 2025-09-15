// src/user/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Visitor } from '../../visitors/visitors.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  RESIDENT = 'RESIDENT',
  MANAGER = 'MANAGER',
}

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

  @Column({ type: 'enum', enum: UserRole, default: UserRole.RESIDENT })
  role!: UserRole;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet!: Wallet;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  @OneToMany(() => Visitor, (visitor) => visitor.invitedBy)
  invitedVisitors!: Visitor[];
}
