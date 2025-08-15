// src/estate/entities/estate.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('estates') // Optional: name the table explicitly
export class Estate {
  @PrimaryGeneratedColumn()
  id!: number; // Auto-generated ID

  @Column({ unique: true })
  name!: string; // Estate name (unique to avoid duplicates)

  @Column()
  location!: string; // Estate location

  @Column({ nullable: true, type: 'text' })
  description?: string; // Optional description

  @Column({ default: true })
  active!: boolean; // Estate status (default: active)

  @Column({ nullable: true })
  managerName?: string; // Optional: name of estate manager

  @Column({ nullable: true })
  contactNumber?: string; // Optional: estate contact phone

  @Column({ nullable: true })
  totalUnits?: number; // Optional: number of housing units

  @Column({ nullable: true })
  smartIntegration?: boolean; // Whether smart home features are enabled

  @CreateDateColumn()
  createdAt!: Date; // Auto timestamp when record is created

  @UpdateDateColumn()
  updatedAt!: Date; // Auto timestamp when record is updated
}
