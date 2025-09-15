// src/user/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { HomeMember } from '../../home/entities/home-member.entity';
import { Visitor } from '../../visitors/visitors.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  /** Relations */
  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets!: Wallet[];

  @OneToMany(() => HomeMember, (homeMember) => homeMember.user)
  homeMembers!: HomeMember[];

  @OneToMany(() => Visitor, (visitor) => visitor.user)
  invitedVisitors!: Visitor[];
}
