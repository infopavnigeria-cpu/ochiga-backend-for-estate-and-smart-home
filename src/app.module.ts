import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Estate } from './estate/entities/estate.entity';
import { Home } from './home/entities/home.entity';
import { Room } from './room/entities/room.entity';
import { User } from './user/entities/user.entity';
import { HomeMember } from './home/entities/home-member.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { Visitor } from './visitors/visitors.entity';
import { Payment } from './payments/entities/payment.entity';

import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserModule } from './user/user.module';
import { EstateModule } from './estate/estate.module';
import { HomeModule } from './home/home.module';
import { RoomModule } from './room/room.module';
import { WalletModule } from './wallet/wallet.module';
import { VisitorsModule } from './visitors/visitors.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const dbType = config.get<string>('DB_TYPE', 'sqlite'); // default sqlite

        return {
          type: dbType as any,
          host: dbType === 'postgres' ? config.get<string>('DB_HOST', 'localhost') : undefined,
          port: dbType === 'postgres' ? parseInt(config.get<string>('DB_PORT', '5432'), 10) : undefined,
          username: dbType === 'postgres' ? config.get<string>('DB_USERNAME', 'postgres') : undefined,
          password: dbType === 'postgres' ? config.get<string>('DB_PASSWORD', 'postgres') : undefined,
          database: config.get<string>('DB_DATABASE', 'db.sqlite'),
          entities: [Estate, Home, Room, User, HomeMember, Wallet, Visitor, Payment],
          synchronize: true,
        };
      },
    }),

    AuthModule,
    DashboardModule,
    UserModule,
    EstateModule,
    HomeModule,
    RoomModule,
    WalletModule,
    VisitorsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
