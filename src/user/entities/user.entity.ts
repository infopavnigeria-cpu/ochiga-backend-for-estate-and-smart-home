// src/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  Manager = 'manager',
  Resident = 'resident',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'text' })
  role: UserRole;

  @Column({ nullable: true })
  estate?: string;

  @Column({ nullable: true })
  house?: string;

  // you can add records/history later as relations
}
