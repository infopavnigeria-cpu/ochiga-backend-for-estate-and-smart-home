import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estate } from './entities/estate.entity';
import { CreateEstateDto } from './dto/create-estate.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';
import { AiAgent } from '../ai/ai.agent';

@Injectable()
export class EstateService {
  constructor(
    @InjectRepository(Estate)
    private readonly estateRepository: Repository<Estate>,

    // 🧠 Inject AI agent for analysis and summaries
    private readonly aiAgent: AiAgent,
  ) {}

  // ✅ Create a new estate
  async create(createEstateDto: CreateEstateDto): Promise<Estate> {
    const estate = this.estateRepository.create(createEstateDto);
    return await this.estateRepository.save(estate);
  }

  // ✅ Get all estates
  async findAll(): Promise<Estate[]> {
    return await this.estateRepository.find();
  }

  // ✅ Get one estate by ID
  async findOne(id: string): Promise<Estate> {
    const estate = await this.estateRepository.findOne({ where: { id } });
    if (!estate) {
      throw new NotFoundException(`Estate with ID ${id} not found`);
    }
    return estate;
  }

  // ✅ Update estate by ID
  async update(id: string, updateEstateDto: UpdateEstateDto): Promise<Estate> {
    const estate = await this.findOne(id);
    Object.assign(estate, updateEstateDto);
    return await this.estateRepository.save(estate);
  }

  // ✅ Remove estate by ID
  async remove(id: string): Promise<void> {
    const estate = await this.findOne(id);
    await this.estateRepository.remove(estate);
  }

  // 🧠 ---------------- AI-Powered Insights ---------------- //

  /**
   * 🔹 Analyze estate infrastructure and suggest optimization strategies.
   * Can be used by estate managers to evaluate efficiency, cost, or energy usage.
   */
  async analyzeEstatePerformance(estateData: any) {
    const prompt = `
      You are a smart estate management assistant.
      Analyze the following estate data and provide insights on energy efficiency, maintenance,
      resident satisfaction, and infrastructure optimization:

      ${JSON.stringify(estateData, null, 2)}
    `;

    const aiResponse = await this.aiAgent.queryExternalAgent(prompt, estateData);
    return {
      estateData,
      analysis: aiResponse,
    };
  }

  /**
   * 🔹 Generate AI summary for all estates.
   * Useful for global admin dashboards to monitor multiple estates at once.
   */
  async summarizeAllEstates() {
    const estates = await this.findAll();
    const prompt = `
      Summarize and compare the following estates based on performance,
      occupancy, maintenance history, and improvement opportunities:

      ${JSON.stringify(estates, null, 2)}
    `;

    const aiSummary = await this.aiAgent.queryExternalAgent(prompt, estates);
    return {
      totalEstates: estates.length,
      aiSummary,
    };
  }
}
