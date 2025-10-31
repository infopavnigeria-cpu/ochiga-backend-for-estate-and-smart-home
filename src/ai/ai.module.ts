// src/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiAgent } from './ai.agent';

@Module({
  imports: [HttpModule],
  providers: [AiAgent],
  exports: [AiAgent], // <-- So other modules can use it
})
export class AiModule {}
