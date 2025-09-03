import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HomeMember } from '../../home/entities/home-member.entity';

export enum UserRole {
  ADMIN = 'admin',
  RESIDENT = 'resident',
  MANAGER = 'manager',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  // ✅ Use text instead of enum for SQLite
  @Column({ type: 'text', default: 'resident' })
role!: string;

  @OneToMany(() => HomeMember, (member) => member.user)
  homeMembers!: HomeMember[];
}
