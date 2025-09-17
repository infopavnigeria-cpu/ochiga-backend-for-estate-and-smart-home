// src/wallet/dto/update-wallet.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletDto } from './create-wallet.dto';
import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @IsNumber()
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
