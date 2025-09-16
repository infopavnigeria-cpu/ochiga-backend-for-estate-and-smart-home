import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resident } from './entities/resident.entity';
import { CreateResidentDto } from '../dto/create-resident.dto';   // ✅ fixed
import { UpdateResidentDto } from '../dto/update-resident.dto';   // ✅ fixed

@Injectable()
export class ResidentService {
  constructor(
    @InjectRepository(Resident)
    private residentRepo: Repository<Resident>,
  ) {}

  async create(dto: CreateResidentDto): Promise<Resident> {
    const resident = this.residentRepo.create(dto);
    return this.residentRepo.save(resident);
  }

  async findAll(): Promise<Resident[]> {
    return this.residentRepo.find();
  }

  async findOne(id: string): Promise<Resident> {
    const resident = await this.residentRepo.findOne({ where: { id } });
    if (!resident) {
      throw new NotFoundException(`Resident with ID ${id} not found`);
    }
    return resident;
  }

  async update(id: string, dto: UpdateResidentDto): Promise<Resident> {
    const resident = await this.findOne(id);
    Object.assign(resident, dto);
    return this.residentRepo.save(resident);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.residentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Resident with ID ${id} not found`);
    }
    return { message: 'Resident deleted successfully' };
  }
}
