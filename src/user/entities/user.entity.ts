import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// adjust the path when home.entity.ts exists
import { Home } from '../../homes/home.entity';

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

  // One user can own many homes
  @OneToMany(() => Home, (home) => home.owner)
  homes!: Home[];  // <-- "!" fixes the TS2564 error
}