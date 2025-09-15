// src/payments/dto/create-payment.dto.ts
import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  amount!: number; // payment amount in NGN/USD/etc.

  @IsString()
  description!: string; // e.g., "Service charge", "Visitor access fee"

  @IsString()
  provider!: string; // e.g., "paystack" | "flutterwave"

  @IsOptional()
  @IsString()
  currency?: string; // optional override, defaults to NGN in service
}
