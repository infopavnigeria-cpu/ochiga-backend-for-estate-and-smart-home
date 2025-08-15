// src/estate/estate.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estate } from './entities/estate.entity';
import { CreateEstateDto } from './dto/create-estate.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';

@Injectable()
export class EstateService {
  constructor(
    @InjectRepository(Estate)
    private readonly estateRepository: Repository<Estate>,
  ) {}

  async create(createEstateDto: CreateEstateDto): Promise<Estate> {
    const estate = this.estateRepository.create(createEstateDto);
    return this.estateRepository.save(estate);
  }

  async findAll(): Promise<Estate[]> {
    return this.estateRepository.find();
  }

  async findOne(id: number): Promise<Estate> {
    const estate = await this.estateRepository.findOne({ where: { id } });
    if (!estate) throw new NotFoundException(`Estate with ID ${id} not found`);
    return estate;
  }

  async update(id: number, updateEstateDto: UpdateEstateDto): Promise<Estate> {
    const estate = await this.findOne(id);
    Object.assign(estate, updateEstateDto);
    return this.estateRepository.save(estate);
  }

  async remove(id: number): Promise<void> {
    const estate = await this.findOne(id);
    await this.estateRepository.remove(estate);
  }
}
