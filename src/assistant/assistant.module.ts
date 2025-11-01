import { Module } from '@nestjs/common';

// Controllers & Services
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';

// Core Feature Modules (same ones registered in AppModule)
import { AuthModule } from '../auth/auth.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { UserModule } from '../user/user.module';
import { EstateModule } from '../estate/estate.module';
import { HomeModule } from '../home/home.module';
import { RoomModule } from '../room/room.module';
import { WalletModule } from '../wallet/wallet.module';
import { VisitorsModule } from '../visitors/visitors.module';
import { PaymentsModule } from '../payments/payments.module';
import { UtilitiesModule } from '../utilities/utilities.module';
import { CommunityModule } from '../community/community.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { HealthModule } from '../health/health.module';
import { MessageModule } from '../message/message.module';
import { IotModule } from '../iot/iot.module';

@Module({
  imports: [
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
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
