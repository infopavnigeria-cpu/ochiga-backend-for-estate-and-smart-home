import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/entities/user.entity'; // ✅ fixed path

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

  // ✅ Correct ManyToOne relation
  @ManyToOne(() => User, (user) => user.invitedVisitors, { eager: true })
  @JoinColumn({ name: 'invitedById' })
  invitedBy!: User;

  @Column()
  invitedById!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
