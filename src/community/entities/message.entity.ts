// src/community/entities/message.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  sender!: string; // string id or username

  @Column()
  recipient!: string; // string id or username

  @Column('text')
  body!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
