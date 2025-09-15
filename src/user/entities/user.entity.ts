// src/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HomeMember } from '../../home/entities/home-member.entity';
import { UserRole } from '../../enums/user-role.enum';
import { Visitor } from '../../visitors/visitor.entity';   // ✅ import Visitor

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

  @OneToMany(() => Visitor, (visitor: Visitor) => visitor.invitedBy, { cascade: true })
  invitedVisitors!: Visitor[];   // ✅ relation to visitors
}
