// src/home/entities/home-member.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Home } from './home.entity';

export enum HomeRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity()
export class HomeMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.homeMembers, {
    onDelete: 'CASCADE',
    eager: true, // ✅ auto-load user info
  })
  user!: User;

  @ManyToOne(() => Home, (home) => home.members, {
    onDelete: 'CASCADE',
  })
  home!: Home;

  @Column({ type: 'text', default: HomeRole.MEMBER })
  role!: HomeRole;

  @CreateDateColumn()
  joinedAt!: Date;
}
