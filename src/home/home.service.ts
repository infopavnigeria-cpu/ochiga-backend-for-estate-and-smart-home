// src/home/home.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './entities/home.entity';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home)
    private readonly homeRepo: Repository<Home>,
  ) {}

  async create(userId: number, dto: CreateHomeDto) {
    const home = this.homeRepo.create({
      ...dto,
      ownerId: userId, // assuming your Home entity has an ownerId
    });
    return this.homeRepo.save(home);
  }

  async findAll(userId: number) {
    return this.homeRepo.find({
      where: { ownerId: userId },
    });
  }

  async findOne(userId: number, id: number) {
    const home = await this.homeRepo.findOne({ where: { id, ownerId: userId } });
    if (!home) {
      throw new NotFoundException('Home not found');
    }
    return home;
  }

  async update(userId: number, id: number, dto: UpdateHomeDto) {
    const home = await this.findOne(userId, id);
    Object.assign(home, dto);
    return this.homeRepo.save(home);
  }

  async remove(userId: number, id: number) {
    const home = await this.findOne(userId, id);
    return this.homeRepo.remove(home);
  }
}