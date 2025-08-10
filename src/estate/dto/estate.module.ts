// src/estate/estate.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstateService } from './estate.service';
import { EstateController } from './estate.controller';
import { Estate } from './entities/estate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estate])],
  controllers: [EstateController],
  providers: [EstateService],
})
export class EstateModule {}
