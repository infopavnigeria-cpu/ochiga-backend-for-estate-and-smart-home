// src/estate/entities/estate.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('estates')
export class Estate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  location!: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ default: true })
  active!: boolean;

  @Column({ nullable: true })
  managerName?: string;

  @Column({ nullable: true })
  contactNumber?: string;

  @Column({ nullable: true })
  totalUnits?: number;

  @Column({ nullable: true })
  smartIntegration?: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
