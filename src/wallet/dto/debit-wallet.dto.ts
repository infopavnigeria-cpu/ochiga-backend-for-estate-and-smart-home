// src/wallet/dto/debit-wallet.dto.ts
import { IsUUID, IsNumber } from 'class-validator';

export class DebitWalletDto {
  @IsUUID()
  userId!: string;

  @IsNumber()
  amount!: number;
}
