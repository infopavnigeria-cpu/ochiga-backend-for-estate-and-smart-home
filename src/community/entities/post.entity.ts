import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  author!: string;

  @Column('text')
  content!: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  video?: string;

  @Column({ default: 0 })
  likes!: number;

  @Column({ default: false })
  pinned!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
