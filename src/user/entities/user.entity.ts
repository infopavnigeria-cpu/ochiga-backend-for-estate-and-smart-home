import { Notification } from '../../notifications/entities/notification.entity'; // ⬅️ add this import

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', default: UserRole.RESIDENT })
  role!: UserRole;

  @OneToOne(() => Wallet, (wallet) => wallet.user, { cascade: true, eager: true })
  wallet!: Wallet;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  @OneToMany(() => Visitor, (visitor) => visitor.invitedBy, { cascade: true })
  invitedVisitors!: Visitor[];

  @OneToMany(() => HomeMember, (member) => member.user)
  homeMembers!: HomeMember[];

  @OneToMany(() => Resident, (r) => r.user)
  residentRecords!: Resident[];

  // 🔑 Devices owned by this user
  @OneToMany(() => Device, (device) => device.owner)
  devices!: Device[];

  // 🔔 Notifications for this user
  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];
}
