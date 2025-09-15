// src/visitors/visitors.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  fullName!: string;

  @Column()
  visitDate!: Date;

  @ManyToOne(() => User, (user) => user.invitedVisitors, { eager: true, onDelete: 'CASCADE' })
  user!: User;
}
