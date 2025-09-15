import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './visitor.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(@InjectRepository(Visitor) private repo: Repository<Visitor>) {}

  async create(dto: CreateVisitorDto, userId: number) {
    const code = Math.random().toString().slice(2, 8); // 6-digit code
    const visitor = this.repo.create({
      ...dto,
      code,
      invitedBy: { id: userId } as any,
    });
    return this.repo.save(visitor);
  }

  async findAllByUser(userId: number) {
    return this.repo.find({
      where: { invitedBy: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(code: string, status: string) {
    const visitor = await this.repo.findOne({ where: { code } });
    if (!visitor) throw new NotFoundException('Visitor not found');
    visitor.status = status;
    return this.repo.save(visitor);
  }
}
