import { Controller, Get } from '@nestjs/common';

@Controller('api/health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'Ochiga backend is alive ✅',
      timestamp: new Date().toISOString(),
    };
  }
}