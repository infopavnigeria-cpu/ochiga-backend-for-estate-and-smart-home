// src/payments/payments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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

    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
  ) {}

  /** Create a new payment */
  async create(user: User, dto: CreatePaymentDto) {
    // 🧠 Smart cashier: find wallet automatically
    const wallet = await this.walletRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found for this user');
    }

    const payment = this.paymentsRepo.create({
      amount: dto.amount,
      description: dto.description,
      provider: dto.provider,
      currency: dto.currency ?? 'NGN', // ✅ default currency
      reference: uuid(), // ✅ always generated server-side
      status: PaymentStatus.PENDING,
      user,
      wallet,
    });

    return this.paymentsRepo.save(payment);
  }

  async findAll() {
    return this.paymentsRepo.find({ relations: ['user', 'wallet'] });
  }

  async findOne(id: string) {
    return this.paymentsRepo.findOne({
      where: { id },
      relations: ['user', 'wallet'],
    });
  }

  async updateStatus(reference: string, status: PaymentStatus) {
    const payment = await this.paymentsRepo.findOne({ where: { reference } });
    if (!payment) throw new NotFoundException('Payment not found');

    payment.status = status;
    return this.paymentsRepo.save(payment);
  }
}
