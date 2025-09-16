// src/user/resident.service.ts

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

  // 🏡 Add a new resident to the estate register
  async addResident(data: CreateResidentDto): Promise<Resident> {
    const resident = this.residentRepo.create(data); // prepare the resident's "file"
    return this.residentRepo.save(resident); // save the record in the estate register
  }

  // 📋 Get the full list of residents in the estate
  async getAllResidents(): Promise<Resident[]> {
    return this.residentRepo.find(); // return everyone's file
  }

  // 🔍 Find one specific resident by ID (like searching their house file)
  async getResidentById(id: string): Promise<Resident> {
    const resident = await this.residentRepo.findOne({ where: { id } });

    if (!resident) {
      throw new NotFoundException(`Resident with ID ${id} not found in the estate records`);
    }
    return resident; // return that one resident's file
  }

  // 📝 Update a resident's details (e.g., name, house number, estate info)
  async updateResident(id: string, data: UpdateResidentDto): Promise<Resident> {
    const resident = await this.getResidentById(id); // fetch their existing file
    Object.assign(resident, data); // update their info
    return this.residentRepo.save(resident); // save back into the register
  }

  // 🗑️ Remove a resident when they move out of the estate
  async removeResident(id: string): Promise<{ message: string }> {
    const result = await this.residentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Resident with ID ${id} not found in the estate records`);
    }
    return { message: 'Resident deleted successfully from the estate register' };
  }
}
