import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/entities/user.entity'; // correct path

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  purpose!: string;

  @Column()
  time!: string;

  @Column({ default: 'Pending' })
  status!: string;

  @Column({ unique: true })
  code!: string;

  // ✅ safer relation
  @ManyToOne(() => User, (user) => user.invitedVisitors, { eager: true })
  @JoinColumn({ name: 'invitedById' })
  invitedBy!: User;

  @Column()
  invitedById!: string; // keep foreign key

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
