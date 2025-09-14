import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string; // foreign key to User (UUID)

  // store as integer (cents / kobo) for accuracy
  @Column({ type: 'integer', default: 0 })
  balance!: number;

  @Column({ nullable: true })
  currency?: string; // NGN, USD, etc.

  @Column({ default: false })
  isActive!: boolean;

  @CreateDateColumn({ type: 'text' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'text' })
  updatedAt!: Date;
}
