import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AiMemory } from './ai.memory';
import { AiReasoner } from './ai.reasoner';
import { AiAgent } from './ai.agent';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly memory = new AiMemory();
  private readonly reasoner = new AiReasoner();
  private readonly agent: AiAgent;

  constructor(private readonly http: HttpService) {
    this.agent = new AiAgent(this.http);
  }

  async processUserIntent(input: string, context: any = {}): Promise<string> {
    this.logger.log(`🧠 Received input: ${input}`);
    this.memory.remember('last_input', input);

    // Try local reasoning first
    const localResponse = this.reasoner.reason(input, context);
    if (localResponse) {
      this.memory.remember('last_output', localResponse);
      return localResponse;
    }

    // Fallback to external AI agent
    const aiResponse = await this.agent.queryExternalAgent(input, context);
    this.memory.remember('last_output', aiResponse);
    return aiResponse;
  }
}
