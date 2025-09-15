import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post(':userId')
  createWallet(@Param('userId') userId: string) {
    return this.walletService.createWallet(userId);
  }

  @Get(':userId')
  getWallet(@Param('userId') userId: string) {
    return this.walletService.getWallet(userId);
  }

  @Post(':userId/fund')
  fundWallet(@Param('userId') userId: string, @Body('amount') amount: number) {
    return this.walletService.fundWallet(userId, amount);
  }

  @Post(':userId/debit')
  debitWallet(@Param('userId') userId: string, @Body('amount') amount: number) {
    return this.walletService.debitWallet(userId, amount);
  }
}
