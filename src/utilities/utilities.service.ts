import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './entities/bill.entity';
import { Maintenance } from './entities/maintenance.entity';

@Injectable()
export class UtilitiesService {
  constructor(
    @InjectRepository(Bill)
    private billRepo: Repository<Bill>,
    @InjectRepository(Maintenance)
    private maintenanceRepo: Repository<Maintenance>,
  ) {}

  // Bills
  findAllBills() {
    return this.billRepo.find();
  }

  createBill(data: Partial<Bill>) {
    return this.billRepo.save(this.billRepo.create(data));
  }

  // Maintenance
  findAllMaintenance() {
    return this.maintenanceRepo.find();
  }

  createMaintenance(data: Partial<Maintenance>) {
    return this.maintenanceRepo.save(this.maintenanceRepo.create(data));
  }
}
