// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @Public() // ✅ no JWT needed
  @HealthCheck()
  check() {
    return this.health.check([
      // ✅ DB check (timeout after 300ms)
      () => this.db.pingCheck('database', { timeout: 300 }),

      // ✅ Memory heap check (limit 300MB)
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),

      // ✅ Ping google.com to confirm external internet
      () => this.http.pingCheck('google', 'https://www.google.com'),
    ]);
  }
}
