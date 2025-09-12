// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateResidentDto } from './dto/create-resident.dto';
import { RegisterResidentDto } from './dto/register-resident.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class UserService {
  private users = [
    { id: 1, estate: 'P2E Estate', name: 'Ada', house: 'B12', role: 'manager', email: 'ada@p2e.com', records: [], history: [] },
    { id: 2, estate: 'GreenVille', name: 'Emeka', house: 'C4', role: 'resident', email: 'emeka@green.com', records: [], history: [] },
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
      password: null, // will be set later
      inviteToken,
      inviteLink,
      records: [],
      history: [],
      ...createResidentDto,
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

  registerResident(registerDto: RegisterResidentDto) {
    const { inviteToken, password } = registerDto;

    const resident = this.users.find(user => user.inviteToken === inviteToken && user.role === 'resident');
    if (!resident) {
      return { message: 'Invalid or expired invite token' };
    }

    resident.password = password;
    resident.inviteToken = null; // clear so it can’t be reused

    return { message: 'Account setup successful! You can now log in.', resident };
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
}
