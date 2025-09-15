// src/wallet/wallet.service.ts
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

  /** Get wallet by user ID */
  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } }, // ✅ correct relation lookup
      relations: ['user'],
    });

    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  /** Create wallet for user if none exists */
  async createWallet(user: User) {
  const wallet = this.walletRepo.create({
    user: user, // relation is now valid
    balance: 0,
    currency: 'NGN',
  });

  return this.walletRepo.save(wallet);
}

    return this.walletRepo.save(wallet);
  }

  /** Fund wallet (increase balance) */
  async fundWallet(userId: string, amount: number): Promise<Wallet> {
    if (amount <= 0) throw new BadRequestException('Invalid amount');

    const wallet = await this.getWallet(userId);
    wallet.balance += amount;

    return this.walletRepo.save(wallet);
  }

  /** Debit wallet (reduce balance) */
  async debitWallet(userId: string, amount: number): Promise<Wallet> {
    if (amount <= 0) throw new BadRequestException('Invalid amount');

    const wallet = await this.getWallet(userId);
    if (wallet.balance < amount) throw new BadRequestException('Insufficient funds');

    wallet.balance -= amount;
    return this.walletRepo.save(wallet);
  }

  /** Smart: get wallet if exists, else auto-create */
  async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({ where: { user: { id: userId } } });

    if (!wallet) {
      wallet = this.walletRepo.create({
        user: { id: userId } as User,
        balance: 0,
        currency: 'NGN',
        isActive: true,
      });
      wallet = await this.walletRepo.save(wallet);
    }

    return wallet;
  }
}
