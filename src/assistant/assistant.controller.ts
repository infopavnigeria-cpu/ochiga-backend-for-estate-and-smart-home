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

interface CommandRequest {
  command: string;
}

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  /**
   * 🔹 Handle incoming AI/voice/text commands
   * Example body: { "command": "turn on all lights in living room" }
   */
  @Post('command')
  async handleCommand(@Body() body: CommandRequest) {
    const command = body?.command?.trim();

    if (!command) {
      throw new HttpException('Command cannot be empty', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.assistantService.processCommand(command);
      return {
        success: true,
        message: 'Command executed successfully',
        data: result,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: 'Assistant failed to process command',
          error: error?.message || 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 🧠 Test endpoint — for debugging or health checks
   * Route: GET /assistant/ping
   */
  @Get('ping')
  ping() {
    return {
      success: true,
      message: 'Assistant module is active 🚀',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 🔹 Retrieve previously executed command details (if logged)
   * Example route: GET /assistant/command/:id
   */
  @Get('command/:id')
  async getCommandById(@Param('id') id: string) {
    try {
      const result = await this.assistantService.getCommandById(id);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: `Failed to retrieve command with ID ${id}`,
          error: error?.message || 'Command not found',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
