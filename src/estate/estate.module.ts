// src/estate/estate.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstateService } from './estate.service';
import { EstateController } from './estate.controller';
import { Estate } from './entities/estate.entity';
import { AiModule } from '../ai/ai.module'; // ✅ import AiAgent 

@Module({
  imports: [
    TypeOrmModule.forFeature([Estate]),
    AiAgentModule, // ✅ makes AiAgent injectable into EstateService
  ],
  controllers: [EstateController],
  providers: [EstateService],
  exports: [EstateService], // optional but helpful if used elsewhere
})
export class EstateModule {}
