// src/user/entities/resident.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('residents')
export class Resident {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  estate!: string;

  @Column()
  name!: string;

  @Column()
  house!: string;

  // optional JSON/text fields
  @Column('text', { nullable: true })
  records?: string;

  @Column('text', { nullable: true })
  history?: string;

  // optional link back to user account (if resident is a user)
  @ManyToOne(() => User, (user) => user.residentRecords, { nullable: true })
  user?: User;
}
