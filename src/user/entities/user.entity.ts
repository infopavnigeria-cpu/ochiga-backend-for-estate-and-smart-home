// src/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HomeMember } from '../../home/entities/home-member.entity';

export enum UserRole {
  MANAGER = 'manager',
  RESIDENT = 'resident',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

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

  // ✅ Add relation for HomeMembers
  @OneToMany(() => HomeMember, (homeMember) => homeMember.user, { cascade: true })
  homeMembers!: HomeMember[];
}
