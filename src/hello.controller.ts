import { Controller, Get } from '@nestjs/common';

@Controller()
export class HelloController {
  @Get()
  getHello(): string {
    return 'Hello, Ochiga! Your backend is running!';
  }
}
