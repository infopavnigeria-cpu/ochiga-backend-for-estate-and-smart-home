import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

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

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): any {
    const newUser = {
      id: this.users.length + 1,
      ...createUserDto
    };
    this.users.push(newUser);
    return newUser;
  }
}
  getAllUsers() {
    return this.userService.getUsers();
  }
}
  }
}
