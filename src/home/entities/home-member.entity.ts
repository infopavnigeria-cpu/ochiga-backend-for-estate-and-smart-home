import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Home } from './home.entity';

export enum HomeRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity()
export class HomeMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: HomeRole, default: HomeRole.MEMBER })
  role!: HomeRole;

  @ManyToOne(() => User, (user) => user.homeMembers, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Home, (home) => home.members, { onDelete: 'CASCADE' })
  home!: Home;
}
