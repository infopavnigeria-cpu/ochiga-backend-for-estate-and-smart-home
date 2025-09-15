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
  FACILITY_MANAGER = 'FACILITY_MANAGER',
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

  // 👛 A user can have many wallets
  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets!: Wallet[];

  // 💳 A user can make many payments
  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  // 🚪 A user can invite many visitors
  @OneToMany(() => Visitor, (visitor) => visitor.user)
  invitedVisitors!: Visitor[];

  // 🏠 A user can belong to many homes
  @OneToMany(() => HomeMember, (homeMember) => homeMember.user)
  homeMembers!: HomeMember[];

  /** -------- Timestamps -------- **/
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
