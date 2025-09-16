import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sender!: string; // Later, this could be a User relation

  @Column()
  recipient!: string; // Later, this could also be a User relation

  @Column('text')
  content!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
