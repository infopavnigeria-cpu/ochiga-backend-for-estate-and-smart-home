import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { HomeMember } from '../../home/entities/home-member.entity';
import { UserRole } from '../../enums/user-role.enum';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Visitor } from '../../visitors/visitors.entity'; // keep import

@Entity()
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

  // ✅ safer relation
  @OneToMany(() => Visitor, (visitor) => visitor.invitedBy, {
    cascade: true,
  })
  invitedVisitors!: Visitor[];

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet!: Wallet;
}
