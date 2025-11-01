import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  /**
   * Handle incoming AI/voice/text commands from the user
   * Example body: { "command": "turn on all lights in living room" }
   */
  @Post('command')
  async handleCommand(@Body() body: { command: string }) {
    if (!body.command || !body.command.trim()) {
      throw new HttpException('Command cannot be empty', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.assistantService.processCommand(body.command);
      return {
        success: true,
        message: 'Command executed successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Assistant failed to process command',
          error: error.message || error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * (Optional) Test endpoint — for debugging or connectivity checks
   */
  @Get('ping')
  ping() {
    return {
      message: 'Assistant module is active 🚀',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * (Optional) Command recall — check the meaning or log of past command
   * Example route: GET /assistant/command/123
   */
  @Get('command/:id')
  async getCommandById(@Param('id') id: string) {
    try {
      const result = await this.assistantService.getCommandById(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve command',
          error: error.message || error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
