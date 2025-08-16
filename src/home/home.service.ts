import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './home.entity';
import { User } from '../user/user.entity';
import { Estate } from '../estates/estate.entity';

@Injectable()
export class HomesService {
  constructor(
    @InjectRepository(Home)
    private homesRepo: Repository<Home>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Estate)
    private estatesRepo: Repository<Estate>,
  ) {}

  async createHome(userId: number, estateId: number, name: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const estate = await this.estatesRepo.findOne({ where: { id: estateId } });

    const home = this.homesRepo.create({ name, user, estate });
    return this.homesRepo.save(home);
  }

  async findAllByUser(userId: number) {
    return this.homesRepo.find({ where: { user: { id: userId } }, relations: ['estate', 'rooms'] });
  }
}
