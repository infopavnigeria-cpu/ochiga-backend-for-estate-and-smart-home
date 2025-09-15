import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class HomeMember {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  relation!: string; // e.g. spouse, child, tenant

  // 🏠 Many home members belong to one user (the house owner/admin)
  @ManyToOne(() => User, (user) => user.homeMembers, {
    onDelete: 'CASCADE',
  })
  user!: User;
}
