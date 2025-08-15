import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './entities/home.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home)
    private homeRepository: Repository<Home>,
  ) {}

  async findOne(userId: number, homeId: number): Promise<Home> {
    const home = await this.homeRepository.findOne({
      where: { id: homeId, userId }, // assumes Home has userId for ownership
      relations: ['rooms'], // ✅ Load rooms automatically
    });

    if (!home) {
      throw new NotFoundException('Home not found or not owned by this user');
    }

    return home;
  }
}
