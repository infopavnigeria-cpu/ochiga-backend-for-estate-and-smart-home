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

  // Create a new estate
  async create(createEstateDto: CreateEstateDto): Promise<Estate> {
    const estate = this.estateRepository.create(createEstateDto);
    return await this.estateRepository.save(estate);
  }

  // Get all estates
  async findAll(): Promise<Estate[]> {
    return await this.estateRepository.find();
  }

  // Get one estate by ID
  async findOne(id: number): Promise<Estate> {
    const estate = await this.estateRepository.findOne({ where: { id } });
    if (!estate) {
      throw new NotFoundException(`Estate with ID ${id} not found`);
    }
    return estate;
  }

  // Update estate by ID
  async update(id: number, updateEstateDto: UpdateEstateDto): Promise<Estate> {
    const estate = await this.findOne(id);
    Object.assign(estate, updateEstateDto);
    return await this.estateRepository.save(estate);
