// src/wallet/wallet.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';

interface Wallet {
  userId: number;
  balance: number;
  history: { type: 'credit' | 'debit'; amount: number; date: Date }[];
}

@Injectable()
export class WalletService {
  private wallets: Wallet[] = [];

  getWallet(userId: number): Wallet {
    const wallet = this.wallets.find(w => w.userId === userId);
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  createWallet(userId: number): Wallet {
    const wallet: Wallet = { userId, balance: 0, history: [] };
    this.wallets.push(wallet);
    return wallet;
  }

  fundWallet(userId: number, amount: number): Wallet {
    const wallet = this.getWallet(userId);
    wallet.balance += amount;
    wallet.history.push({ type: 'credit', amount, date: new Date() });
    return wallet;
  }

  debitWallet(userId: number, amount: number): Wallet {
    const wallet = this.getWallet(userId);
    if (wallet.balance < amount) throw new Error('Insufficient funds');
    wallet.balance -= amount;
    wallet.history.push({ type: 'debit', amount, date: new Date() });
    return wallet;
  }
}
