import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './visitor.entity';
import { User } from '../user/entities/user.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';

@Injectable()
export class VisitorService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepo: Repository<Visitor>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createVisitor(userId: string, dto: CreateVisitorDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const visitor = this.visitorRepo.create({
      name: dto.name,
      status: 'Pending',
      code: dto.code,
      invitedBy: user,
    });

    return this.visitorRepo.save(visitor);
  }

  async findByUser(userId: string) {
    return this.visitorRepo.find({ where: { invitedBy: { id: userId } } });
  }
}
