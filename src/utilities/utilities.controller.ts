import { Controller, Get, Post, Body } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { Bill } from './entities/bill.entity';
import { Maintenance } from './entities/maintenance.entity';

@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  // Bills
  @Get('bills')
  getBills(): Promise<Bill[]> {
    return this.utilitiesService.findAllBills();
  }

  @Post('bills')
  createBill(@Body() data: Partial<Bill>) {
    return this.utilitiesService.createBill(data);
  }

  // Maintenance
  @Get('maintenance')
  getMaintenance(): Promise<Maintenance[]> {
    return this.utilitiesService.findAllMaintenance();
  }

  @Post('maintenance')
  createMaintenance(@Body() data: Partial<Maintenance>) {
    return this.utilitiesService.createMaintenance(data);
  }
}
