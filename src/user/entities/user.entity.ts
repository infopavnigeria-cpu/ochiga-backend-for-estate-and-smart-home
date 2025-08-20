import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Home } from '../../homes/entities/home.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  // Example relation: one user can own many homes
  @OneToMany(() => Home, (home) => home.owner)
  homes: Home[];
}