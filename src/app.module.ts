import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';

// ✅ Feature modules
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UserModule } from './user/user.module';
import { EstateModule } from './estate/estate.module';
import { HomeModule } from './home/home.module';
import { RoomModule } from './room/room.module';
import { WalletModule } from './wallet/wallet.module';
import { VisitorsModule } from './visitors/visitors.module';
import { PaymentsModule } from './payments/payments.module';
import { UtilitiesModule } from './utilities/utilities.module';
import { CommunityModule } from './community/community.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';
import { MessageModule } from './message/message.module';
import { IotModule } from './iot/iot.module'; // 👈 Added IoT module import

// ✅ Global Guards
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    // 🌍 Global environment config
    ConfigModule.forRoot({ isGlobal: true }),

    // 🗄️ Database connection using async helper
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async () => {
        const dbConfig = await getDatabaseConfig(); // ✅ MUST await async config
        return {
          ...dbConfig,
          autoLoadEntities: true, // ✅ auto-detect all entities across modules
          entities: [__dirname + '/**/*.entity{.ts,.js}'], // ✅ ensures all entity files load
        };
      },
    }),

    // 🧩 Feature Modules
    AuthModule,
    DashboardModule,
    UserModule,
    EstateModule,
    HomeModule,
    RoomModule,
    WalletModule,
    VisitorsModule,
    PaymentsModule,
    UtilitiesModule,
    CommunityModule,
    NotificationsModule,
    HealthModule,
    MessageModule,
    IotModule, // 👈 Added to register Device + DeviceLog entities
  ],

  providers: [
    // 🛡️ Global guards
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {
  static dbType: 'postgres' | 'sqlite';

  constructor(private readonly config: ConfigService) {
    AppModule.dbType = (config.get<string>('DB_TYPE') || 'sqlite').toLowerCase() as
      | 'postgres'
      | 'sqlite';
  }
}
