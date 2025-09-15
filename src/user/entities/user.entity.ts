import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HomeMember } from '../../home/entities/home-member.entity';
import { UserRole } from '../../enums/user-role.enum';
import { Visitor } from '../../visitors/visitor.entity';

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

  @OneToMany(() => HomeMember, (homeMember: HomeMember) => homeMember.user, { cascade: true })
  homeMembers!: HomeMember[];

  // ✅ Visitors invited by this user
  @OneToMany(() => Visitor, (visitor: Visitor) => visitor.invitedBy, { cascade: true })
  invitedVisitors!: Visitor[];
}
