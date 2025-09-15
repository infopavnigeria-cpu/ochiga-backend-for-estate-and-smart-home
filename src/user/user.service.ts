import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ✅ Create a new user
  async createUser(data: CreateUserDto): Promise<User> {
    const newUser = this.userRepo.create({
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role ?? UserRole.RESIDENT, // fallback if no role passed
    });

    return await this.userRepo.save(newUser);
  }

  // ✅ Get all users
  async findAll(): Promise<User[]> {
    return await this.userRepo.find({
      relations: ['wallets', 'invitedVisitors'], // preload relations
    });
  }

  // ✅ Get single user by ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['wallets', 'invitedVisitors'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // ✅ Update user
  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, data);

    return await this.userRepo.save(user);
  }

  // ✅ Delete user
  async removeUser(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
  }
}
