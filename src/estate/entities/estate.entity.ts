import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Home } from '../../home/entities/home.entity';

@Entity('estates')
export class Estate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  location!: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ default: true })
  active!: boolean;

  @Column({ nullable: true })
  managerName?: string;

  @Column({ nullable: true })
  contactNumber?: string;

  @Column({ nullable: true })
  totalUnits?: number;

  @Column({ default: false })
  smartIntegration!: boolean;

  @Column({ type: 'text', nullable: true })
  settings?: string;

  @OneToMany(() => Home, (home) => home.estate)
  homes!: Home[];

  @CreateDateColumn({ type: 'text' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'text' })
  updatedAt!: Date;
}
