// src/community/entities/post.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  author!: string;

  @Column('text')
  content!: string;

  @Column({ type: 'int', default: 0 })
  likes!: number;

  @Column({ default: false })
  pinned!: boolean;

  @OneToMany(() => Comment, (c) => c.post, { cascade: true })
  comments!: Comment[];

  @Column({ type: 'json', nullable: true })
  media?: any; // image/video metadata if needed

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
