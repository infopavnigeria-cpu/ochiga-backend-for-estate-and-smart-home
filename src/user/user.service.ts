// src/user/user.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.getUserById(id); // throws if not found
    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }
}
