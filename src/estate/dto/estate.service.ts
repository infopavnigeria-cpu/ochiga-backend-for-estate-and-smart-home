import { Injectable } from '@nestjs/common';
import { CreateEstateDto } from './dto/create-estate.dto';
import { Estate } from './estate.entity';

@Injectable()
export class EstateService {
  private estates: Estate[] = [];

  create(dto: CreateEstateDto): Estate {
    const estate: Estate = {
      id: this.estates.length + 1,
      ...dto,
    };
    this.estates.push(estate);
    return estate;
  }

  findAll(): Estate[] {
    return this.estates;
  }
}
