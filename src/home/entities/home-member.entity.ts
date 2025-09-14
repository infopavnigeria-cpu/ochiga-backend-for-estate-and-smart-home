// src/home/entities/home-member.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Home } from './home.entity';

export enum HomeRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity()
export class HomeMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number; // ✅ FK column

  @Column()
  homeId!: number; // ✅ FK column

  @ManyToOne(() => User, (user) => user.homeMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // links FK to User
  user!: User;

  @ManyToOne(() => Home, (home) => home.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'homeId' }) // links FK to Home
  home!: Home;

  @Column({ type: 'text', default: HomeRole.MEMBER })
  role!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt!: Date;
}
