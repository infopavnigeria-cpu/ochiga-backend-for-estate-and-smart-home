import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Estate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  description?: string;
}
