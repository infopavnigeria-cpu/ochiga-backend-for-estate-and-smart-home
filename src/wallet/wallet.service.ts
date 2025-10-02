// src/wallet/wallet.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../user/entities/user.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
  ) {}

  /** Get wallet by user ID */
  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  /** Create wallet for user if none exists */
  async createWallet(userId: string): Promise<Wallet> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const wallet = this.walletRepo.create({
      user,
      balance: 0,
      currency: 'NGN',
    });

    return this.walletRepo.save(wallet);
  }

  /** Fund wallet (increase balance + log transaction) */
  async fundWallet(userId: string, amount: number, description?: string): Promise<Wallet> {
    if (amount <= 0) throw new BadRequestException('Invalid amount');

    const wallet = await this.getWallet(userId);
    wallet.balance = Number(wallet.balance) + amount;
    await this.walletRepo.save(wallet);

    const tx = this.txRepo.create({
      type: 'fund',
      amount,
      userId,
      description: description || 'Wallet funded',
      wallet,
    });
    await this.txRepo.save(tx);

    return wallet;
  }

  /** Debit wallet (reduce balance + log transaction) */
  async debitWallet(userId: string, amount: number, description?: string): Promise<Wallet> {
    if (amount <= 0) throw new BadRequestException('Invalid amount');

    const wallet = await this.getWallet(userId);
    if (Number(wallet.balance) < amount) throw new BadRequestException('Insufficient funds');

    wallet.balance = Number(wallet.balance) - amount;
    await this.walletRepo.save(wallet);

    const tx = this.txRepo.create({
      type: 'debit',
      amount,
      userId,
      description: description || 'Wallet debited',
      wallet,
    });
    await this.txRepo.save(tx);

    return wallet;
  }

  /** Smart: get wallet if exists, else auto-create */
  async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!wallet) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      wallet = this.walletRepo.create({
        user,
        balance: 0,
        currency: 'NGN',
      });
      wallet = await this.walletRepo.save(wallet);
    }

    return wallet;
  }

  /** Get all transactions for a user */
  async getTransactions(userId: string): Promise<Transaction[]> {
    return this.txRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
