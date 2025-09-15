import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async createWallet(userId: string): Promise<Wallet> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let wallet = await this.walletRepo.findOne({ where: { userId } });
    if (wallet) throw new BadRequestException('Wallet already exists for this user');

    wallet = this.walletRepo.create({ user, userId, balance: 0, isActive: true });
    return this.walletRepo.save(wallet);
  }

  async fundWallet(userId: string, amount: number): Promise<Wallet> {
    if (amount <= 0) throw new BadRequestException('Invalid amount');
    const wallet = await this.getWallet(userId);
    wallet.balance += amount;
    return this.walletRepo.save(wallet);
  }

  async debitWallet(userId: string, amount: number): Promise<Wallet> {
    if (amount <= 0) throw new BadRequestException('Invalid amount');
    const wallet = await this.getWallet(userId);
    if (wallet.balance < amount) throw new BadRequestException('Insufficient funds');

    wallet.balance -= amount;
    return this.walletRepo.save(wallet);
  }
}
