import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
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
  status!: string; // Pending | Checked-in | Checked-out

  @Column({ unique: true })
  code!: string; // unique visitor code / QR

  @ManyToOne(() => User, (user) => user.invitedVisitors, { eager: true })
  invitedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
