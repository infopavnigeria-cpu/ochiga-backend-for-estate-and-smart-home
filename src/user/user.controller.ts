import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  getAllUsers(): any {
    return [
      { id: 1, name: 'Jane Doe' },
      { id: 2, name: 'John Doe' }
    ];
  }
}
