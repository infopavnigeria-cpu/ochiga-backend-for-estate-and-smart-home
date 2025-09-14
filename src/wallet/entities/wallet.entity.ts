import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string; // foreign key to User (UUID)

  @Column({
    type: process.env.DB_TYPE === 'sqlite' ? 'real' : 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  balance!: number;

  @Column({ nullable: true })
  currency!: string; // NGN, USD, etc.

  @Column({ default: false })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
