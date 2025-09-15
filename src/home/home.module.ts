// src/home/home.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './entities/home.entity';
import { HomeMember } from './entities/home-member.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Home, HomeMember, Wallet])],
  providers: [HomeService],
  controllers: [HomeController],
  exports: [HomeService],
})
export class HomeModule {}
