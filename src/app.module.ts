// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { EstateModule } from './estate/estate.module';
import { Estate } from './estate/entities/estate.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Estate], // You can add other entities here like User
      synchronize: true, // Only for development
    }),
    UserModule,      // Correctly import and add the UserModule
    EstateModule,    // Correctly import and add the EstateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
