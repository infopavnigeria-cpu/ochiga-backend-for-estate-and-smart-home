import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Home } from './home.entity';

export enum HomeRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  RESIDENT = 'resident',
}

@Entity()
export class HomeMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.memberships, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Home, (home) => home.members, { onDelete: 'CASCADE' })
  home!: Home;

  @Column({
    type: 'enum',
    enum: HomeRole,
    default: HomeRole.RESIDENT,
  })
  role!: HomeRole;
}