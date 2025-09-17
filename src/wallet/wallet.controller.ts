import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { DebitWalletDto } from './dto/debit-wallet.dto';

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
  fundWallet(@Param('userId') userId: string, @Body() dto: FundWalletDto) {
    return this.walletService.fundWallet(userId, dto.amount);
  }

  @Post(':userId/debit')
  debitWallet(@Param('userId') userId: string, @Body() dto: DebitWalletDto) {
    return this.walletService.debitWallet(userId, dto.amount);
  }
}
