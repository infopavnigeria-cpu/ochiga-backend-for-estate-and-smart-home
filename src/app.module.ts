import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as net from 'net';

// Feature modules (preserved)
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

// Global Guards (preserve your existing guards)
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    // Load env early and globally
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeORM - async factory to decide between Postgres or SQLite
    TypeOrmModule.forRootAsync({
      imports: [/* no additional imports needed */],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        // canonical env names
        const dbType = (config.get<string>('DB_TYPE') || 'sqlite').toLowerCase();
        const host = config.get<string>('DB_HOST', 'postgres');
        const port = Number(config.get<string>('DB_PORT', '5432'));
        const username = config.get<string>('DB_USERNAME', config.get<string>('DB_USER', 'postgres'));
        const password = config.get<string>('DB_PASSWORD', config.get<string>('DB_PASS', 'postgres'));
        const database = config.get<string>('DB_DATABASE', config.get<string>('DB_NAME', 'estate_app'));

        // Try to detect Postgres availability (Docker friendly)
        const tryPostgres = dbType === 'postgres' || dbType === 'auto';
        if (tryPostgres) {
          const isPostgresAvailable = await new Promise<boolean>((resolve) => {
            const socket = new net.Socket();
            socket
              .setTimeout(1000)
              .once('connect', () => {
                socket.destroy();
                resolve(true);
              })
              .once('error', () => resolve(false))
              .once('timeout', () => resolve(false))
              .connect(port, host);
          });

          if (isPostgresAvailable) {
            console.log('✅ Using PostgreSQL (TypeOrm).');
            return {
              type: 'postgres' as const,
              host,
              port,
              username,
              password,
              database,
              entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
              migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
              synchronize: config.get<boolean>('SQLITE_SYNC', false) ? true : false, // keep false in prod
              logging: true,
            };
          } else {
            console.warn('⚠️ Postgres not reachable — falling back to SQLite.');
          }
        }

        // SQLite fallback (local dev)
        const sqlitePath = config.get<string>('SQLITE_PATH', './data/estate.sqlite');
        console.log('💾 Using SQLite (TypeOrm) at', sqlitePath);
        return {
          type: 'sqlite' as const,
          database: path.resolve(process.cwd(), sqlitePath),
          entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
          migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
          synchronize: config.get<boolean>('SQLITE_SYNC', true), // dev friendly default
          logging: true,
        };
      },
    }),

    // Feature modules
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
  ],

  providers: [
    // keep guards global
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
