import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/entities/user.entity'; // corrected path

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user: User) => user.invitedVisitors, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user!: User;
}
