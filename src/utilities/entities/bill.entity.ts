// src/utilities/entities/bill.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string; // Electricity, Water, Security levy

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  amount!: number;

  @Column({ default: 'UNPAID' })
  status!: string; // PAID / UNPAID

  @Column({ nullable: true })
  dueDate?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
