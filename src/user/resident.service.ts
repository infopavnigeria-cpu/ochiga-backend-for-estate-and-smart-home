// src/user/resident.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resident } from './entities/resident.entity';

@Injectable()
export class ResidentService {
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepo: Repository<Resident>,
  ) {}

  async create(dto: Partial<Resident>): Promise<Resident> {
    const resident = this.residentRepo.create(dto);
    return this.residentRepo.save(resident);
  }

  async findAll(): Promise<Resident[]> {
    return this.residentRepo.find();
  }

  async findOne(id: string): Promise<Resident> {   // 🔑 id must be string (UUID)
    const resident = await this.residentRepo.findOne({ where: { id } });
    if (!resident) {
      throw new NotFoundException(`Resident with ID ${id} not found`);
    }
    return resident;
  }

  async update(id: string, dto: Partial<Resident>): Promise<Resident> {  // 🔑 also string
    const resident = await this.findOne(id);
    Object.assign(resident, dto);
    return this.residentRepo.save(resident);
  }

  async remove(id: string): Promise<{ message: string }> {  // 🔑 also string
    const result = await this.residentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Resident with ID ${id} not found`);
    }
    return { message: 'Resident deleted successfully' };
  }
}
