import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './visitors.entity';
import { User } from '../user/entities/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private readonly repo: Repository<Visitor>,
  ) {}

  async create(user: User, data: Partial<Visitor>) {
    const visitor = this.repo.create({
      ...data,
      invitedBy: user,
      code: uuid(), // generate unique visitor code
    });
    return this.repo.save(visitor);
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
