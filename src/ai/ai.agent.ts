import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

/**
 * AiAgent
 * Handles external AI queries (e.g., to OpenAI API)
 * for intelligent reasoning, suggestions, and automation decisions.
 */
export class AiAgent {
  private readonly logger = new Logger(AiAgent.name);

  constructor(private readonly http: HttpService) {}

  /**
   * Sends a prompt to the external AI model (like OpenAI GPT-4o-mini)
   * and returns the assistant’s textual response.
   *
   * @param input - The prompt or user query
   * @param context - Optional metadata/context for better reasoning
   */
  async queryExternalAgent(input: string, context?: Record<string, any>): Promise<string> {
    try {
      const payload = {
        model: 'gpt-4o-mini', // You can adjust this to your preferred model
        messages: [
          {
            role: 'system',
            content:
              'You are Ochiga Smart Infrastructure AI assistant. You analyze, decide, and respond naturally.',
          },
          { role: 'user', content: input },
        ],
      };

      const response = await lastValueFrom(
        this.http.post('https://api.openai.com/v1/chat/completions', payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }),
      );

      const result = response.data?.choices?.[0]?.message?.content || 'No response.';
      this.logger.log(`🤖 Agent response: ${result}`);
      return result;
    } catch (err: unknown) {
      // ✅ Type-safe error handling
      if (err instanceof Error) {
        this.logger.error(`❌ External AI connection failed: ${err.message}`);
      } else {
        this.logger.error('❌ External AI connection failed: Unknown error', err);
      }
      return 'I cannot connect to the reasoning server right now.';
    }
  }
}
