// src/visitors/visitor.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './visitor.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private repo: Repository<Visitor>,
  ) {}

  async create(dto: CreateVisitorDto, user: User): Promise<Visitor> {
    const code = Math.random().toString().slice(2, 8); // 6-digit code

    const visitor = this.repo.create({
      ...dto,
      code,
      invitedBy: user,
    });

    return this.repo.save(visitor);
  }

  async findByUser(userId: string): Promise<Visitor[]> {
    return this.repo.find({
      where: { invitedBy: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
