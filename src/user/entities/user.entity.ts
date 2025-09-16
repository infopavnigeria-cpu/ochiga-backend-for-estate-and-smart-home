import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Visitor } from '../../visitors/visitor.entity'; // 🔥 fix path
import { HomeMember } from '../../home/entities/home-member.entity';
import { UserRole } from '../../enums/user-role.enum'; // 🔥 fix path

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

  @Column({ type: 'enum', enum: UserRole, default: UserRole.RESIDENT })
  role!: UserRole;

  // --- Relations ---
  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true })
  wallet!: Wallet; // ✅ one user → one wallet

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  payments!: Payment[];

  @OneToMany(() => Visitor, (visitor) => visitor.user, { cascade: true })
  invitedVisitors!: Visitor[];

  @OneToMany(() => HomeMember, (homeMember) => homeMember.user, { cascade: true })
  homeMembers!: HomeMember[];
}
