import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { Home } from './entities/home.entity';

@Injectable()
export class HomeService {
  private homes: Home[] = [];
  private idCounter = 1;

  create(userId: number, dto: CreateHomeDto): Home {
    const home: Home = {
      id: this.idCounter++,
      name: dto.name,
      address: dto.address,
      userId
    };
    this.homes.push(home);
    return home;
  }

  findAll(userId: number): Home[] {
    return this.homes.filter(home => home.userId === userId);
  }

  findOne(userId: number, id: number): Home {
    const home = this.homes.find(h => h.id === id);
    if (!home) throw new NotFoundException('Home not found');
    if (home.userId !== userId) throw new ForbiddenException('Access denied');
    return home;
  }

  update(userId: number, id: number, dto: UpdateHomeDto): Home {
    const home = this.findOne(userId, id);
    Object.assign(home, dto);
    return home;
  }

  remove(userId: number, id: number): void {
    const index = this.homes.findIndex(h => h.id === id && h.userId === userId);
    if (index === -1) throw new NotFoundException('Home not found or access denied');
    this.homes.splice(index, 1);
  }
}
