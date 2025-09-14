import { Injectable, BadRequestException } from '@nestjs/common';

export enum UserRole {
  RESIDENT = 'resident',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export interface User {
  id: number;
  email: string;
  password: string;
  role?: UserRole; // optional for now
}

@Injectable()
export class UserService {
  private users: User[] = [];

  createUser(data: { email: string; password: string; role?: UserRole }): User {
    const exists = this.users.find(u => u.email === data.email);
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const newUser: User = {
      id: this.users.length + 1,
      email: data.email,
      password: data.password, // hash later
      role: data.role || UserRole.RESIDENT,
    };

    this.users.push(newUser);
    return newUser;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}
