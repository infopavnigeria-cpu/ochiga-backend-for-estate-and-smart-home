import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private users = [
    { id: 1, estate: 'P2E Estate', name: 'Ada', house: 'B12', records: [], history: [] },
    { id: 2, estate: 'GreenVille', name: 'Emeka', house: 'C4', records: [], history: [] },
  ];

  getAllUsers() {
    return this.users;
  }

  createUser(createUserDto: CreateUserDto) {
    const newUser = {
      id: this.users.length + 1,
      records: [],
      history: [],
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
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
