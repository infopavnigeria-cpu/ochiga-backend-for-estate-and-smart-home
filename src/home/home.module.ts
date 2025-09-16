import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from './entities/home.entity';
import { HomeMember } from './entities/home-member.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { User } from '../user/entities/user.entity';   // ✅ bring in User entity

import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Home, HomeMember, Wallet, User]),  // ✅ add User here
  ],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}
