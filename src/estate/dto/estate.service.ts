// src/estate/estate.service.ts
import { Injectable } from '@nestjs/common';
import { CreateEstateDto } from './dto/create-estate.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';

@Injectable()
export class EstateService {
  create(createEstateDto: CreateEstateDto) {
    return { message: 'Estate created', data: createEstateDto };
  }

  findAll() {
    return [{ id: 1, name: 'Estate One' }];
  }

  findOne(id: number) {
    return { id, name: `Estate ${id}` };
  }

  update(id: number, updateEstateDto: UpdateEstateDto) {
    return { message: `Estate ${id} updated`, data: updateEstateDto };
  }

  remove(id: number) {
    return { message: `Estate ${id} removed` };
  }
}
