// src/wallet/dto/fund-wallet.dto.ts
import { IsUUID, IsNumber } from 'class-validator';

export class FundWalletDto {
  @IsUUID()
  userId!: string;

  @IsNumber()
  amount!: number;
}
