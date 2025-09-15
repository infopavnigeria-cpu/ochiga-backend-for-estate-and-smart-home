// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';   // ✅ import ConfigModule

import { Estate } from './estate/entities/estate.entity';
import { Home } from './home/entities/home.entity';
import { Room } from './room/entities/room.entity';
import { User } from './user/entities/user.entity';
import { HomeMember } from './home/entities/home-member.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { Payment } from './payments/entities/payment.entity'; // ✅ add Payment entity

import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserModule } from './user/user.module';
import { EstateModule } from './estate/estate.module';
import { HomeModule } from './home/home.module';
import { RoomModule } from './room/room.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentsModule } from './payments/payments.module'; // ✅ add PaymentsModule

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // ✅ loads .env everywhere

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [
        Estate,
        Home,
        Room,
        User,
        HomeMember,
        Wallet,
        Payment, // ✅ include Payment entity
      ],
      synchronize: true,
    }),

    AuthModule,
    DashboardModule,
    UserModule,
    EstateModule,
    HomeModule,
    RoomModule,
    WalletModule,
    PaymentsModule, // ✅ now live
  ],
})
export class AppModule {}
