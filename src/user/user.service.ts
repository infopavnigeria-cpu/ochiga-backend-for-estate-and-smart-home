import { Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { CreateResidentDto } from './dto/create-resident.dto';
import { User, UserRole } from './entities/user.entity';
import * as QRCode from 'qrcode';

@Injectable()
export class UserService {
  private users: User[] = [
    { id: 1, name: 'Ada', email: 'ada@p2e.com', role: UserRole.Manager, password: '123456', records: [], history: [] },
    { id: 2, name: 'Emeka', email: 'emeka@green.com', role: UserRole.Resident, estate: 'GreenVille', house: 'C4', password: null, inviteToken: 'sample-token', records: [], history: [] },
  ];

  getAllUsers() {
    return this.users;
  }

  createManager(dto: CreateManagerDto) {
    const newManager: User = {
      id: this.users.length + 1,
      role: UserRole.Manager,
      records: [],
      history: [],
      ...dto,
    };
    this.users.push(newManager);
    return newManager;
  }

  async createResident(dto: CreateResidentDto) {
    const inviteToken = `invite-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const inviteLink = `http://localhost:3000/register?token=${inviteToken}`;

    const newResident: User = {
      id: this.users.length + 1,
      role: UserRole.Resident,
      password: null,
      inviteToken,
      inviteLink,
      records: [],
      history: [],
      ...dto,
    };

    this.users.push(newResident);

    const qrCodeDataUrl = await QRCode.toDataURL(inviteLink);

    return {
      message: 'Resident created successfully. Share invite link/QR code with them.',
      resident: newResident,
      inviteLink,
      qrCode: qrCodeDataUrl,
    };
  }

  getUserById(id: number) {
    return this.users.find(user => user.id === id);
  }

  updateUser(id: number, updateData: Partial<User>) {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updateData);
    return user;
  }

  registerResident(inviteToken: string, password: string) {
    const user = this.users.find(u => u.role === UserRole.Resident && u.inviteToken === inviteToken);
    if (!user) {
      return { success: false, message: 'Invalid or expired invite token' };
    }
    if (user.password) {
      return { success: false, message: 'Resident already registered' };
    }

    user.password = password;
    delete user.inviteToken;
    delete user.inviteLink;

    return { success: true, message: 'Registration successful', user };
  }
}
