import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { HomeMember } from '../../home/entities/home-member.entity';
import { UserRole } from '../../enums/user-role.enum';
import { Visitor } from '../../visitors/visitors.entity'; // ✅ correct path
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'text', default: UserRole.RESIDENT })
  role!: UserRole;

  @Column({ nullable: true })
  estate?: string;

  @Column({ nullable: true })
  house?: string;

  @OneToMany(() => HomeMember, (homeMember) => homeMember.user, {
    cascade: true,
  })
  homeMembers!: HomeMember[];

  // ✅ Relation to visitors
  @OneToMany(() => Visitor, (visitor) => visitor.invitedBy, {
    cascade: true,
  })
  invitedVisitors!: Visitor[];

  // ✅ One-to-one link to Wallet
  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet!: Wallet;
}
