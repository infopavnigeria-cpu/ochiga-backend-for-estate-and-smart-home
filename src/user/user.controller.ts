import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Users') // 👈 Groups endpoints under "Users" in Swagger
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }

  // 🔥 /user/me requires JWT
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token') // 👈 enables Swagger JWT
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
