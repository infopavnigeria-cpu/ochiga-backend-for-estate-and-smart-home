// src/user/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Visitor } from '../../visitors/visitors.entity';
import { HomeMember } from '../../home/entities/home-member.entity';
import { Resident } from './resident.entity';
import { UserRole } from '../../enums/user-role.enum';

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

  // One user has one wallet
  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true, eager: true })
  wallet!: Wallet;

  // Payments by this user
  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  // Visitors invited by this user
  @OneToMany(() => Visitor, (visitor) => visitor.invitedBy, { cascade: true })
  invitedVisitors!: Visitor[];

  // Memberships in homes
  @OneToMany(() => HomeMember, (member) => member.user)
  homeMembers!: HomeMember[];

  // For resident model if used
  @OneToMany(() => Resident, (r) => r.user)
  residentRecords!: Resident[];
}
