import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepo: Repository<Payment>,
  ) {}

  async create(user: User, wallet: Wallet, dto: CreatePaymentDto) {
    const payment = this.paymentsRepo.create({
      ...dto,
      user,
      wallet,
      reference: uuid(), // unique payment ref
      status: PaymentStatus.PENDING,
    });
    return this.paymentsRepo.save(payment);
  }

  async findAll() {
    return this.paymentsRepo.find({ relations: ['user', 'wallet'] });
  }

  async findOne(id: string) {
    return this.paymentsRepo.findOne({
      where: { id }, // ✅ keep id as UUID string
      relations: ['user', 'wallet'],
    });
  }

  async updateStatus(reference: string, status: PaymentStatus) {
    const payment = await this.paymentsRepo.findOne({ where: { reference } });
    if (!payment) throw new Error('Payment not found');

    payment.status = status;
    return this.paymentsRepo.save(payment);
  }
}
