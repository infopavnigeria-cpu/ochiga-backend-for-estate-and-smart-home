// src/payments/payments.controller.ts
import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from '../user/entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreatePaymentDto) {
    const user = (req as any).user as User; // ✅ injected by AuthGuard
    return this.paymentsService.create(user, dto); // ✅ only 2 args
  }

  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post('webhook/:provider')
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() body: any,
  ) {
    const { reference, status } = body;
    return this.paymentsService.updateStatus(reference, status);
  }
}
