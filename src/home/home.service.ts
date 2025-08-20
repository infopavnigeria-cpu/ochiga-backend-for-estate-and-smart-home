// src/home/home.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './entities/home.entity';
import { HomeMember, HomeRole } from './entities/home-member.entity';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home)
    private readonly homeRepo: Repository<Home>,

    @InjectRepository(HomeMember)
    private readonly memberRepo: Repository<HomeMember>,
  ) {}

  /** Create a home and add creator as OWNER */
  async create(userId: number, dto: CreateHomeDto) {
    const home = this.homeRepo.create(dto);
    const savedHome = await this.homeRepo.save(home);

    const member = this.memberRepo.create({
      home: savedHome,
      user: { id: userId } as any, // reference user correctly
      role: 'OWNER' as HomeRole,
    });
    await this.memberRepo.save(member);

    return savedHome;
  }

  /** Get all homes a user belongs to */
  async findAll(userId: number) {
    const memberships = await this.memberRepo.find({
      where: { user: { id: userId } },
      relations: ['home'],
    });
    return memberships.map((m) => m.home);
  }

  /** Helper: check if user is a member of a home */
  private async ensureMembership(userId: number, homeId: number) {
    const member = await this.memberRepo.findOne({
      where: { user: { id: userId }, home: { id: homeId } },
      relations: ['home'],
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this home');
    }
    return member;
  }

  /** Get one home */
  async findOne(userId: number, id: number) {
    await this.ensureMembership(userId, id);

    const home = await this.homeRepo.findOne({ where: { id } });
    if (!home) throw new NotFoundException('Home not found');
    return home;
  }

  /** Update a home (only OWNER or ADMIN allowed) */
  async update(userId: number, id: number, dto: UpdateHomeDto) {
    const member = await this.ensureMembership(userId, id);
    if (member.role !== 'OWNER' && member.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update this home');
    }

    Object.assign(member.home, dto);
    return this.homeRepo.save(member.home);
  }

  /** Remove a home (only OWNER allowed) */
  async remove(userId: number, id: number) {
    const member = await this.ensureMembership(userId, id);
    if (member.role !== 'OWNER') {
      throw new ForbiddenException('Only the OWNER can delete this home');
    }

    return this.homeRepo.remove(member.home);
  }
}