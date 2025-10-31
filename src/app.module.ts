import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, DataSource } from '@nestjs/typeorm';
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
import { IotModule } from './iot/iot.module';

// ✅ Global Guards
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async () => ({
        ...(await getDatabaseConfig()),
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
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
    IotModule,
  ],

  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements OnModuleInit {
  static dbType: 'postgres' | 'sqlite';

  constructor(
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    AppModule.dbType = (config.get<string>('DB_TYPE') || 'sqlite').toLowerCase() as
      | 'postgres'
      | 'sqlite';
  }

  async onModuleInit() {
    const entities = this.dataSource.entityMetadatas;
    console.log('🚀 --- Ochiga Smart Backend Boot Summary ---');
    console.log(`📦 Database Type: ${AppModule.dbType.toUpperCase()}`);
    console.log(`🧩 Registered Entities: ${entities.length}`);
    console.log(
      '🔗 Entities:',
      entities.map((e) => e.name).join(', ') || 'None found',
    );
    console.log('✅ System initialized and ready to serve requests.\n');
  }
}
