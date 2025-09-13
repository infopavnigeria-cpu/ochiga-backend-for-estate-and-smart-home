import { Body, Controller, Get, Post, Param, Put, UseGuards, Request } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🔒 Only logged-in users (any role)
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  // 🔒 Managers only
  @Get('all-residents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  getAllResidents() {
    return this.userService.getAllUsers();
  }

  // 🔒 Residents only
  @Get('my-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('resident')
  getMyData(@Request() req) {
    return this.userService.getUserById(req.user.id);
  }
}
