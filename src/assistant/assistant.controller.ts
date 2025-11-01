import { Controller, Post, Body } from '@nestjs/common';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('command')
  async handleCommand(@Body() body: { command: string }) {
    return await this.assistantService.processCommand(body.command);
  }
}
