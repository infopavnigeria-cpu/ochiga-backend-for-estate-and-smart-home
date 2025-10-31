import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

export class AiAgent {
  private readonly logger = new Logger(AiAgent.name);

  constructor(private readonly http: HttpService) {}

  async queryExternalAgent(input: string, context: any): Promise<string> {
    try {
      const payload = {
        model: 'gpt-4o-mini', // or your deployed model
        messages: [
          { role: 'system', content: 'You are Ochiga Smart Infrastructure AI assistant. You analyze, decide, and respond naturally.' },
          { role: 'user', content: input },
        ],
      };

      const response = await lastValueFrom(
        this.http.post('https://api.openai.com/v1/chat/completions', payload, {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }),
      );

      const result = response.data.choices?.[0]?.message?.content || 'No response.';
      this.logger.log(`🤖 Agent response: ${result}`);
      return result;
    } catch (error) {
      this.logger.error('❌ External AI connection failed:', error.message);
      return 'I cannot connect to the reasoning server right now.';
    }
  }
}
