import { Module } from '@nestjs/common';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';
import { IotModule } from '../iot/iot.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [IotModule, WalletModule],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
