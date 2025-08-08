import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstateModule } from './estate/estate.module';

@Module({
  imports: [EstateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
