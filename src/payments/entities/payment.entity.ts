import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  amount!: number;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Wallet, (wallet) => wallet.payments, { onDelete: 'CASCADE' })
  wallet!: Wallet;
}
