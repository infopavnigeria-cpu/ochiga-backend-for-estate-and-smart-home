// src/home/home-member.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeMember } from './entities/home-member.entity';

@Injectable()
export class HomeMemberService {
  constructor(
    @InjectRepository(HomeMember)
    private readonly homeMemberRepo: Repository<HomeMember>,
  ) {}

  async findMembership(userId: number, homeId: number): Promise<HomeMember | null> {
    return this.homeMemberRepo.findOne({
      where: { userId, homeId }, // ✅ simpler now
      relations: ['user', 'home'], // still load full User + Home objects
    });
  }

  async addMember(userId: number, homeId: number, role = 'MEMBER'): Promise<HomeMember> {
    const member = this.homeMemberRepo.create({ userId, homeId, role });
    return this.homeMemberRepo.save(member);
  }

  async getMembers(homeId: number): Promise<HomeMember[]> {
    return this.homeMemberRepo.find({
      where: { homeId },
      relations: ['user'],
    });
  }
}
