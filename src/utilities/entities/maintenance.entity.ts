// src/utilities/entities/maintenance.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('maintenance_requests')
export class Maintenance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  issue!: string;

  @Column({ default: 'PENDING' })
  status!: string; // PENDING, IN_PROGRESS, RESOLVED

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
