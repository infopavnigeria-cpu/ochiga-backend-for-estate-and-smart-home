import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateResidentDto } from './dto/create-resident.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class UserService {
  private users = [
    { id: 1, estate: 'P2E Estate', name: 'Ada', house: 'B12', role: 'manager', email: 'ada@p2e.com', password: '123456', records: [], history: [] },
    { id: 2, estate: 'GreenVille', name: 'Emeka', house: 'C4', role: 'resident', email: 'emeka@green.com', password: null, inviteToken: 'sample-token', records: [], history: [] },
  ];

  getAllUsers() {
    return this.users;
  }

  createUser(createUserDto: CreateUserDto) {
    const newUser = {
      id: this.users.length + 1,
      role: 'manager',
      records: [],
      history: [],
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  async createResident(createResidentDto: CreateResidentDto) {
    const inviteToken = `invite-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const inviteLink = `http://localhost:3000/register?token=${inviteToken}`;

    const newResident = {
      id: this.users.length + 1,
      role: 'resident',
      password: null, // set later via register
      inviteToken,
      inviteLink,
      records: [],
      history: [],
      ...createResidentDto,
    };

    this.users.push(newResident);

    // Generate QR Code for the invite link
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

  updateUser(id: number, updateData: Partial<any>) {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updateData);
    return user;
  }

  // 🔑 New: register a resident using inviteToken
  registerResident(inviteToken: string, password: string) {
    const user = this.users.find(
      (u) => u.role === 'resident' && u.inviteToken === inviteToken,
    );
    if (!user) {
      return { success: false, message: 'Invalid or expired invite token' };
    }
    if (user.password) {
      return { success: false, message: 'Resident already registered' };
    }

    user.password = password;
    delete user.inviteToken; // remove token after use
    delete user.inviteLink;

    return { success: true, message: 'Registration successful', user };
  }
}
