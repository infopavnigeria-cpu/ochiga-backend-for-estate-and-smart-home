import { Controller, Post, Body, Get, Param, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from './entities/payment.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreatePaymentDto) {
    // assume req.user is injected via AuthGuard
    return this.paymentsService.create(req.user, req.user.wallet, dto);
  }

  @Get()
  async findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Post('webhook/:provider')
  async handleWebhook(@Param('provider') provider: string, @Body() body: any) {
    // TODO: implement Paystack/Flutterwave webhook parsing
    const { reference, status } = body;
    return this.paymentsService.updateStatus(
      reference,
      status === 'success' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
    );
  }
}
