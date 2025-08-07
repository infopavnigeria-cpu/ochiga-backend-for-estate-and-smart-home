import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello.controller'; // 👈 Add this line

@Module({
  imports: [],
  controllers: [AppController, HelloController], // 👈 Register both controllers
  providers: [AppService],
})
export class AppModule {}
