// src/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { TokenUser } from '../types/token-user.interface';

// Better: Extend Express Request for typing
interface AuthenticatedRequest extends Request {
  user: TokenUser;
}

@Controller('dashboard')
export class DashboardController {
  @Get('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('manager')
  getManagerDashboard(@Request() req: AuthenticatedRequest) {
    return {
      message: 'Welcome Manager!',
      user: req.user,
    };
  }

  @Get('resident')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('resident')
  getResidentDashboard(@Request() req: AuthenticatedRequest) {
    return {
      message: 'Welcome Resident!',
      user: req.user,
    };
  }
}
