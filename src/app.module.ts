import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Estate } from './estate/entities/estate.entity';
import { Home } from './home/entities/home.entity';
import { Room } from './room/entities/room.entity';
import { User } from './user/entities/user.entity';
import { HomeMember } from './home/entities/home-member.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { Visitor } from './visitors/visitors.entity';   // ✅ fixed (plural file)
import { Payment } from './payments/entities/payment.entity';

import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserModule } from './user/user.module';
import { EstateModule } from './estate/estate.module';
import { HomeModule } from './home/home.module';
import { RoomModule } from './room/room.module';
import { WalletModule } from './wallet/wallet.module';
import { VisitorsModule } from './visitors/visitors.module'; // ✅ correct
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

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
        Visitor,   // ✅ entity points to correct file
        Payment,
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
    VisitorsModule,   // ✅ module name matches
    PaymentsModule,
  ],
})
export class AppModule {}
