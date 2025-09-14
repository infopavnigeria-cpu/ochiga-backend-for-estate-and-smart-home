// src/user/user.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const exists = await this.userRepo.findOne({ where: { email: data.email } });
    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.userRepo.create({
      ...data,
      role: data.role ?? UserRole.RESIDENT,
    });

    return this.userRepo.save(newUser);
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } }); // ✅ id is string
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    await this.userRepo.update(id, updateData); // ✅ uuid string accepted
    return this.getUserById(id);
  }
}
