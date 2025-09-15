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
    private walletsRepo: Repository<Wallet>,
  ) {}

  async create(user: User, dto: CreatePaymentDto) {
    const wallet = await this.walletsRepo.findOne({
      where: { user: { id: user.id } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found for this user');
    }

    const payment = this.paymentsRepo.create({
      ...dto,
      user,
      wallet,
      reference: dto.reference ?? uuid(), // allow override if provided
      status: PaymentStatus.PENDING,
    });

    return this.paymentsRepo.save(payment);
  }

  async findAll() {
    return this.paymentsRepo.find({ relations: ['user', 'wallet'] });
  }

  async findOne(id: string) {
    const payment = await this.paymentsRepo.findOne({
      where: { id },
      relations: ['user', 'wallet'],
    });

    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async updateStatus(reference: string, status: string) {
    const payment = await this.paymentsRepo.findOne({ where: { reference } });
    if (!payment) throw new NotFoundException('Payment not found');

    let mappedStatus: PaymentStatus;
    switch (status.toLowerCase()) {
      case 'success':
        mappedStatus = PaymentStatus.SUCCESS;
        break;
      case 'failed':
        mappedStatus = PaymentStatus.FAILED;
        break;
      default:
        mappedStatus = PaymentStatus.PENDING;
    }

    payment.status = mappedStatus;
    return this.paymentsRepo.save(payment);
  }
}
