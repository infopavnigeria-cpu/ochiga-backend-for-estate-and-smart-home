// src/home/entities/home-member.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Home } from './home.entity';

export enum HomeRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity('home_members')
export class HomeMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.homeMembers, { onDelete: 'CASCADE', eager: true })
  user!: User;

  @ManyToOne(() => Home, (home) => home.members, { onDelete: 'CASCADE' })
  home!: Home;

  @Column({ type: 'enum', enum: HomeRole, default: HomeRole.MEMBER })
  role!: HomeRole;

  @CreateDateColumn()
  joinedAt!: Date;
}
