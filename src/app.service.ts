import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): string {
    return '🚀 Ochiga backend is active!';
  }
}
