import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  balance!: number;

  @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  user!: User;
}
