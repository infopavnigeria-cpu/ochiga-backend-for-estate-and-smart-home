// src/estate/entities/estate.entity.ts
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
  @PrimaryGeneratedColumn()
  id!: number;

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

  // Smart integrations flag
  @Column({ default: false })
  smartIntegration!: boolean;

  // Extra: estate-wide settings (JSON for flexibility)
  @Column({ type: 'json', nullable: true })
  settings?: Record<string, any>;

  // Relation → Homes
  @OneToMany(() => Home, (home) => home.estate)
  homes!: Home[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
