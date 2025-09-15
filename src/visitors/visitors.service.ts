import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './visitors.entity';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorsRepo: Repository<Visitor>,
  ) {}

  async create(visitor: Partial<Visitor>) {
    const newVisitor = this.visitorsRepo.create(visitor);
    return this.visitorsRepo.save(newVisitor);
  }

  async findAll() {
    return this.visitorsRepo.find();
  }

  async findOne(id: string) {
    return this.visitorsRepo.findOne({ where: { id } });
  }
}
