import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column({ default: false })
  isOn!: boolean;

  @Column('jsonb', { nullable: true }) // switched from string to JSONB
  metadata!: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;
}
