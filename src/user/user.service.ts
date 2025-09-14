import { Injectable, BadRequestException } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  private users: User[] = [];

  createUser(data: { email: string; password: string }): User {
    const exists = this.users.find(u => u.email === data.email);
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const newUser: User = {
      id: this.users.length + 1,
      email: data.email,
      password: data.password, // 🔐 will hash later
    };

    this.users.push(newUser);
    return newUser;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }
}
