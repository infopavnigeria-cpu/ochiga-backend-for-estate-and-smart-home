// src/user/entities/resident.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Resident {
  @PrimaryGeneratedColumn()
  id!: number;   // definite assignment

  @Column()
  estate!: string;

  @Column()
  name!: string;

  @Column()
  house!: string;

  @Column("simple-array", { nullable: true })
  records: string[] = [];   // default empty array

  @Column("simple-array", { nullable: true })
  history: string[] = [];   // default empty array
}
