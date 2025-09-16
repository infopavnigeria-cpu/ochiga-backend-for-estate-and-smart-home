import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create({
      ...data,
      role: data.role ?? UserRole.RESIDENT,
    });
    return this.userRepo.save(newUser);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['wallet', 'payments', 'invitedVisitors', 'homeMembers'],
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  // ✅ alias for findOne so controller works
  async getUserById(id: string): Promise<User> {
    return this.findOne(id);
  }

  // ✅ update user
  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOne(id); // throws if not found
    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }
}
