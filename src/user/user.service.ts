// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** ✅ Create new user */
  async create(data: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create({
      ...data,
      role: data.role ?? UserRole.RESIDENT, // default role
    });
    return this.userRepo.save(newUser);
  }

  /** 🔄 Alias for controller compatibility */
  async createUser(data: Partial<User>): Promise<User> {
    return this.create(data);
  }

  /** ✅ Get user by ID */
  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: [
        'wallet',
        'payments',
        'invitedVisitors',
        'homeMembers',
        'residentRecords',
        'devices',
        'notifications',
      ],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  /** 🔄 Alias for controller compatibility */
  async getUserById(id: string): Promise<User> {
    return this.findById(id);
  }

  /** ✅ Get user by email (for login/register) */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      relations: ['wallet', 'payments'],
    });
  }

  /** ✅ Get all users */
  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      relations: [
        'wallet',
        'payments',
        'invitedVisitors',
        'homeMembers',
        'residentRecords',
        'devices',
        'notifications',
      ],
    });
  }

  /** ✅ Update user */
  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }

  /** 🔄 Alias for controller compatibility */
  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    return this.update(id, updateData);
  }

  /** ✅ Delete user */
  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepo.remove(user);
  }
}
