import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resident } from './entities/resident.entity';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';

@Injectable()
export class ResidentService {
  constructor(
    @InjectRepository(Resident)
    private residentRepo: Repository<Resident>,
  ) {}

  // Add a new resident
  async createResident(dto: CreateResidentDto): Promise<Resident> {
    const resident = this.residentRepo.create(dto);
    return this.residentRepo.save(resident);
  }

  // View all residents in the estate
  async getAllResidents(): Promise<Resident[]> {
    return this.residentRepo.find();
  }

  // View details of a single resident
  async getResidentById(id: string): Promise<Resident> {
    const resident = await this.residentRepo.findOne({ where: { id } });
    if (!resident) {
      throw new NotFoundException(`Resident with ID ${id} not found`);
    }
    return resident;
  }

  // Update a resident’s details
  async updateResident(id: string, dto: UpdateResidentDto): Promise<Resident> {
    const resident = await this.getResidentById(id);
    Object.assign(resident, dto);
    return this.residentRepo.save(resident);
  }

  // Remove a resident
  async removeResident(id: string): Promise<{ message: string }> {
    const result = await this.residentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Resident with ID ${id} not found`);
    }
    return { message: 'Resident deleted successfully' };
  }
}
