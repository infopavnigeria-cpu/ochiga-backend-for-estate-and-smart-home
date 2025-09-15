import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreatePaymentDto) {
    const user: any = (req as any).user; // ✅ comes from AuthGuard
    return this.paymentsService.create(user, dto);
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
