import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Visitor } from '../../visitors/visitors.entity';
import { HomeMember } from '../../home/entities/home-member.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  RESIDENT = 'RESIDENT',
  SECURITY = 'SECURITY',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.RESIDENT,
  })
  role!: UserRole;

  /** -------- Relations -------- **/

  // 💳 User can have many wallets
  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets!: Wallet[];

  // 💸 User can have many payments
  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  // 🏠 User can have many home members
  @OneToMany(() => HomeMember, (member) => member.user)
  homeMembers!: HomeMember[];

  // 👥 User can invite many visitors
  @OneToMany(() => Visitor, (visitor) => visitor.user)
  invitedVisitors!: Visitor[];

  /** -------- Timestamps -------- **/
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
