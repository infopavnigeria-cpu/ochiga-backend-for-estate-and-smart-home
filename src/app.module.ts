// src/estate/estate.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstateModule } from './estate/estate.module';
import { Estate } from './estate/entities/estate.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // You can switch to 'postgres' or 'mysql'
      database: 'db.sqlite',
      entities: [Estate],
      synchronize: true, // Auto-create tables (good for dev only)
    }),
    EstateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
