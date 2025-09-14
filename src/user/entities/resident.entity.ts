import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Resident {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  estate!: string;

  @Column()
  name!: string;

  @Column()
  house!: string;

  @Column('simple-array', { nullable: true })
  records: string[] = [];

  @Column('simple-array', { nullable: true })
  history: string[] = [];
}
