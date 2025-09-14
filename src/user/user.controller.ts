import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService, UserRole } from './user.service';
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
  @Roles(UserRole.MANAGER)
  getAllResidents() {
    return this.userService.getAllUsers();
  }

  // 🔒 Residents only
  @Get('my-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESIDENT)
  getMyData(@Request() req: { user: { id: number } }) {
    return this.userService.getUserById(req.user.id);
  }
}
