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

  /**
   * Create a home inside an estate and link an owner as a member
   */
  async createHome(
    name: string,
    estateId: number,
    ownerId: number,
  ): Promise<Home> {
    const estate = await this.estatesRepo.findOneBy({ id: estateId });
    if (!estate) throw new Error('Estate not found');

    const owner = await this.usersRepo.findOneBy({ id: ownerId });
    if (!owner) throw new Error('User not found');

    // ✅ Home has no "user" property anymore
    const home = this.homesRepo.create({ name, estate });
    await this.homesRepo.save(home);

    // ✅ Relationship handled via HomeMember
    const membership = this.membersRepo.create({
      home,
      user: owner,
      role: 'OWNER',
    });
    await this.membersRepo.save(membership);

    return home;
  }

  /**
   * Add another user to a home with a role
   */
  async addMember(
    homeId: number,
    userId: number,
    role: 'ADMIN' | 'MEMBER' = 'MEMBER',
  ): Promise<HomeMember> {
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

  /**
   * Find all members of a home
   */
  async getMembers(homeId: number): Promise<HomeMember[]> {
    return this.membersRepo.find({
      where: { home: { id: homeId } },
      relations: ['user', 'home'],
    });
  }
}