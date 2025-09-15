// src/visitors/visitors.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  purpose!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ default: 'PENDING' })
  status!: string;

  @ManyToOne(() => User, (user) => user.invitedVisitors, { eager: true })
  @JoinColumn({ name: 'invitedById' })
  invitedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
