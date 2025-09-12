// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateResidentDto } from './dto/create-resident.dto';

@Injectable()
export class UserService {
  private users = [
    { id: 1, estate: 'P2E Estate', name: 'Ada', house: 'B12', role: 'manager', records: [], history: [] },
    { id: 2, estate: 'GreenVille', name: 'Emeka', house: 'C4', role: 'resident', records: [], history: [] },
  ];

  getAllUsers() {
    return this.users;
  }

  createUser(createUserDto: CreateUserDto) {
    const newUser = {
      id: this.users.length + 1,
      role: 'manager', // default for createUser
      records: [],
      history: [],
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  createResident(createResidentDto: CreateResidentDto) {
    const newResident = {
      id: this.users.length + 1,
      role: 'resident',
      password: null, // they’ll set it later
      records: [],
      history: [],
      ...createResidentDto,
    };
    this.users.push(newResident);

    return {
      message: 'Resident created successfully. Share invite link with them.',
      resident: newResident,
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
}
