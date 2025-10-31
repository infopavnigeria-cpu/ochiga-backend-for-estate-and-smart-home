import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './entities/visitors.entity';
import { AiAgent } from '../ai/ai.agent';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorsRepo: Repository<Visitor>,
    private readonly aiAgent: AiAgent, // 🧠 AI Agent
  ) {}

  async create(visitor: Partial<Visitor>) {
    const newVisitor = this.visitorsRepo.create(visitor);
    return this.visitorsRepo.save(newVisitor);
  }

  async findAll() {
    return this.visitorsRepo.find();
  }

  async findOne(id: string) {
    const visitor = await this.visitorsRepo.findOne({ where: { id } });
    if (!visitor) throw new NotFoundException('Visitor not found');
    return visitor;
  }

  // 🧠 AI Feature: Predict visitor trends or anomalies
  async predictVisitorTrends(visitorLogs: any) {
    const prompt = `Analyze visitor logs to identify behavioral patterns, potential anomalies, or security alerts:
    ${JSON.stringify(visitorLogs, null, 2)}`;

    return await this.aiAgent.queryExternalAgent(prompt, visitorLogs);
  }

  // 🧠 AI Feature: Recommend security measures based on visitor trends
  async suggestSecurityImprovements(visitorLogs: any) {
    const prompt = `Based on these visitor patterns, suggest security improvements for access control, surveillance, and alert protocols:
    ${JSON.stringify(visitorLogs, null, 2)}`;

    return await this.aiAgent.queryExternalAgent(prompt, visitorLogs);
  }
}
