// src/community/entities/group.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'int', default: 0 })
  members!: number;

  @Column({ default: false })
  joined!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
