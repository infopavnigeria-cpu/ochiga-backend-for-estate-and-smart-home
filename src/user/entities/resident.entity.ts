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

  // Stored as comma-separated text in SQLite
  @Column('text', { nullable: true })
  records?: string; // convert manually to array

  @Column('text', { nullable: true })
  history?: string; // convert manually to array
}
