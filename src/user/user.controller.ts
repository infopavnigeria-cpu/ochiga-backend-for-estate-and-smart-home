import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface AuthenticatedRequest {
  user: {
    id: string; // ✅ now uuid
    email: string;
    role: UserRole;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get('all-residents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  getAllResidents() {
    return this.userService.getAllUsers();
  }

  @Get('my-data')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESIDENT)
  getMyData(@Request() req: AuthenticatedRequest) {
    return this.userService.getUserById(req.user.id);
  }
}
