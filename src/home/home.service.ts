// src/home/home.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './entities/home.entity';
import { HomeMember } from './entities/home-member.entity';
import { User } from '../user/entities/user.entity';
import { Estate } from '../estate/entities/estate.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home) private readonly homesRepo: Repository<Home>,
    @InjectRepository(HomeMember) private readonly membersRepo: Repository<HomeMember>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Estate) private readonly estatesRepo: Repository<Estate>,
  ) {}

  async createHome(name: string, estateId: number, ownerId: number): Promise<Home> {
    const estate = await this.estatesRepo.findOneBy({ id: estateId });
    if (!estate) throw new Error('Estate not found');

    const owner = await this.usersRepo.findOneBy({ id: ownerId });
    if (!owner) throw new Error('User not found');

    const home = this.homesRepo.create({ name, estate });
    await this.homesRepo.save(home);

    const membership = this.membersRepo.create({
      home,
      user: owner,
      role: 'OWNER',
    });
    await this.membersRepo.save(membership);

    return home;
  }

  async addMember(homeId: number, userId: number, role: 'ADMIN' | 'MEMBER' = 'MEMBER') {
    const home = await this.homesRepo.findOneBy({ id: homeId });
    if (!home) throw new Error('Home not found');

    const user = await this.usersRepo.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');

    const membership = this.membersRepo.create({
      home,
      user,
      role,
    });

    return this.membersRepo.save(membership);
  }
}