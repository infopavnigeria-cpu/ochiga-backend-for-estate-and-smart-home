// src/wallet/wallet.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post(':userId')
  createWallet(@Param('userId') userId: number) {
    return this.walletService.createWallet(Number(userId));
  }

  @Get(':userId')
  getWallet(@Param('userId') userId: number) {
    return this.walletService.getWallet(Number(userId));
  }

  @Post(':userId/fund')
  fundWallet(@Param('userId') userId: number, @Body('amount') amount: number) {
    return this.walletService.fundWallet(Number(userId), Number(amount));
  }

  @Post(':userId/debit')
  debitWallet(@Param('userId') userId: number, @Body('amount') amount: number) {
    return this.walletService.debitWallet(Number(userId), Number(amount));
  }
}
