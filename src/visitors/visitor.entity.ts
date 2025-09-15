import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  purpose: string;

  @Column()
  time: string; // ⏰ Could be string or Date

  @Column({ default: 'Pending' })
  status: string; // Pending | Checked-in | Checked-out

  @Column({ unique: true })
  code: string; // unique QR code

  @ManyToOne(() => User, (user) => user.visitors, { eager: true })
  invitedBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
