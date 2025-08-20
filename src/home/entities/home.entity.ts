import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Estate } from '../../estate/entities/estate.entity';
import { Room } from '../room/room.entity';
import { User } from '../../user/entities/user.entity';
import { HomeMember } from './home-member.entity';

@Entity()
export class Home {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Estate, (estate) => estate.homes, { onDelete: 'CASCADE' })
  estate!: Estate;

  // One home has many members (owner, admins, moderators, etc.)
  @OneToMany(() => HomeMember, (member) => member.home, { cascade: true })
  members!: HomeMember[];

  @OneToMany(() => Room, (room) => room.home, { cascade: true })
  rooms!: Room[];
}
}