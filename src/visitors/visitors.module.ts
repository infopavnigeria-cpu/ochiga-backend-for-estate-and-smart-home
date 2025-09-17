import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Visitor } from './entities/visitor.entity';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Visitor])],
  providers: [VisitorsService],
  controllers: [VisitorsController],
  exports: [VisitorsService], // so UserModule or others can use it if needed
})
export class VisitorsModule {}
