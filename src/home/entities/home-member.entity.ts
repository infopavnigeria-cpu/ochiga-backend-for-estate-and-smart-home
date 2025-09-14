import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.homeMembers, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Home, (home) => home.members, { onDelete: 'CASCADE' })
  home!: Home;

  @Column({
    type: process.env.DB_TYPE === 'sqlite' ? 'text' : 'enum',
    enum: HomeRole,
    default: HomeRole.MEMBER,
  })
  role!: HomeRole;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt!: Date;
}
