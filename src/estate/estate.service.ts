import { Injectable } from '@nestjs/common';
import { CreateEstateDto } from './dto/create-estate.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';

@Injectable()
export class EstateService {
  create(createEstateDto: CreateEstateDto) {
    return `This action adds a new estate: ${createEstateDto.name}`;
  }

  findAll() {
    return `This action returns all estates`;
  }

  findOne(id: number) {
    return `This action returns estate #${id}`;
  }

  update(id: number, updateEstateDto: UpdateEstateDto) {
    return `This action updates estate #${id}`;
  }

  remove(id: number) {
    return `This action removes estate #${id}`;
  }
}
