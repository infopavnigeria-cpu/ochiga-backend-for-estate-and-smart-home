// src/estate/entities/estate.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Estate {
  @PrimaryGeneratedColumn()
  id!: number; // Auto-generated ID

  @Column()
  name!: string; // Estate name

  @Column()
  location!: string; // Estate location

  @Column({ nullable: true })
  description?: string; // Optional description

  @Column({ default: true })
  active!: boolean; // Estate status (default: active)
}
