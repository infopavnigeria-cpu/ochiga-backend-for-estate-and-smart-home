// src/home/home.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './entities/home.entity';
import { HomeMember, HomeRole } from './entities/home-member.entity';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home)
    private readonly homeRepo: Repository<Home>,

    @InjectRepository(HomeMember)
    private readonly memberRepo: Repository<HomeMember>,

    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
  ) {}

  /** Create a home and add creator as OWNER (auto-creates wallet if missing) */
  async create(userId: string, dto: CreateHomeDto) {
    const home = this.homeRepo.create(dto);
    const savedHome = await this.homeRepo.save(home);

    // create membership
    const member = this.memberRepo.create({
      home: savedHome,
      user: { id: userId } as User,
      role: HomeRole.OWNER,
    });
    await this.memberRepo.save(member);

    // auto-create wallet if missing
    let wallet = await this.walletRepo.findOne({ where: { user: { id: userId } } });
    if (!wallet) {
      wallet = this.walletRepo.create({
        user: { id: userId } as User,
        balance: 0,
        currency: 'NGN',
        isActive: true,
      });
      await this.walletRepo.save(wallet);
    }

    return { ...savedHome, wallet };
  }

  /** Get all homes a user belongs to */
  async findAll(userId: string) {
    const memberships = await this.memberRepo.find({
      where: { user: { id: userId } },
      relations: ['home', 'home.members'],
    });
    return memberships.map((m) => m.home);
  }

  /** Helper: check if user is a member of a home */
  private async ensureMembership(userId: string, homeId: string) {
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
  async findOne(userId: string, id: string) {
    await this.ensureMembership(userId, id);

    const home = await this.homeRepo.findOne({
      where: { id },
      relations: ['members', 'rooms'],
    });
    if (!home) throw new NotFoundException('Home not found');
    return home;
  }

  /** Update a home (only OWNER or ADMIN allowed) */
  async update(userId: string, id: string, dto: UpdateHomeDto) {
    const member = await this.ensureMembership(userId, id);
    if (![HomeRole.OWNER, HomeRole.ADMIN].includes(member.role)) {
      throw new ForbiddenException('Only admins can update this home');
    }

    Object.assign(member.home, dto);
    return this.homeRepo.save(member.home);
  }

  /** Remove a home (only OWNER allowed) */
  async remove(userId: string, id: string) {
    const member = await this.ensureMembership(userId, id);
    if (member.role !== HomeRole.OWNER) {
      throw new ForbiddenException('Only the OWNER can delete this home');
    }

    await this.homeRepo.delete(id);
    return { message: 'Home deleted successfully' };
  }
}
