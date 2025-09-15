import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/entities/user.entity';

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  purpose!: string;

  @Column({ default: false })
  approved!: boolean;

  // 👥 Many visitors belong to one user (who invited them)
  @ManyToOne(() => User, (user) => user.invitedVisitors, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user!: User;

  @CreateDateColumn()
  invitedAt!: Date;
}
