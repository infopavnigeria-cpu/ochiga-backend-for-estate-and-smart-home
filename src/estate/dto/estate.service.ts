import { Injectable } from '@nestjs/common';
import { CreateEstateDto } from './dto/create-estate.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';

@Injectable()
export class EstateService {
  private estates = [];

  create(createEstateDto: CreateEstateDto) {
    const newEstate = { id: Date.now(), ...createEstateDto };
    this.estates.push(newEstate);
    return newEstate;
  }

  findAll() {
    return this.estates;
  }

  findOne(id: number) {
    return this.estates.find(estate => estate.id === id);
  }

  update(id: number, updateEstateDto: UpdateEstateDto) {
    const index = this.estates.findIndex(estate => estate.id === id);
    if (index > -1) {
      this.estates[index] = { ...this.estates[index], ...updateEstateDto };
      return this.estates[index];
    }
    return null;
  }

  remove(id: number) {
    const index = this.estates.findIndex(estate => estate.id === id);
    if (index > -1) {
      const deleted = this.estates.splice(index, 1);
      return deleted[0];
    }
    return null;
  }
}
