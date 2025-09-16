import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';
import { Bill } from './entities/bill.entity';
import { Maintenance } from './entities/maintenance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Maintenance])],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
})
export class UtilitiesModule {}
