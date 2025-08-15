// src/estate/entities/estate.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Estate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  active!: boolean;
}
