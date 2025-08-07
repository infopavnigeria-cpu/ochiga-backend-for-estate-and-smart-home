import { Controller, Get, Param, NotFoundException } from '@nestjs/common';

@Controller('user')
export class UserController {
  private users = [
    { id: 1, name: 'Jane Doe' },
    { id: 2, name: 'John Doe' }
  ];

  @Get()
  getAllUsers(): any {
    return this.users;
  }

  @Get(':id')
  getUserById(@Param('id') id: string): any {
    const user = this.users.find(u => u.id === parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
