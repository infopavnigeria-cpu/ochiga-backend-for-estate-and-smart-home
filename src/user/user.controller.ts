// src/user/user.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '../enums/user-role.enum'; // ✅ fixed path
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface AuthenticatedRequest {
  user: {
    id: string; // ✅ uuid string
    email: string;
    role: UserRole;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🔒 Any logged-in user
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: AuthenticatedRequest) {
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
  getMyData(@Request() req: AuthenticatedRequest) {
    return this.userService.getUserById(req.user.id);
  }
}
