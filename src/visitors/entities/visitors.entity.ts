@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  purpose?: string;

  @Column({ nullable: true })
  time?: string;

  @Column({ type: 'text', default: 'Pending' })
  status!: string;

  @Column({ unique: true })
  code!: string;

  @ManyToOne(() => User, (user) => user.invitedVisitors, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitedById' })
  invitedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
