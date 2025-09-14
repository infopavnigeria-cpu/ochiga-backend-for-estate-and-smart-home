import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HomeMember } from '../../home/entities/home-member.entity';
import { UserRole } from '../../enums/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  password?: string;

  // ✅ Fix: store enum as string for SQLite compatibility
  @Column({
    type: process.env.DB_TYPE === 'sqlite' ? 'text' : 'enum',
    enum: UserRole,
    default: UserRole.RESIDENT,
  })
  role!: UserRole;

  @Column({ nullable: true })
  estate?: string;

  @Column({ nullable: true })
  house?: string;

  @OneToMany(() => HomeMember, (homeMember: HomeMember) => homeMember.user, { cascade: true })
  homeMembers!: HomeMember[];
}
