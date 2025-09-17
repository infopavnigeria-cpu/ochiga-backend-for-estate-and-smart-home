/// src/wallet/dto/create-wallet.dto.ts
import { IsUUID } from 'class-validator';

export class CreateWalletDto {
  @IsUUID()
  userId!: string;
}
