// src/dashboard/dashboard.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../user/entities/user.entity';

// Reusable type for authenticated requests
interface AuthenticatedRequest {
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}

@Controller('dashboard')
export class DashboardController {
  @Get('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER) // ✅ use uppercase key
  getManagerDashboard(@Request() req: AuthenticatedRequest) {
    return { message: 'Welcome Manager!', user: req.user };
  }

  @Get('resident')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESIDENT) // ✅ use uppercase key
  getResidentDashboard(@Request() req: AuthenticatedRequest) {
    return { message: 'Welcome Resident!', user: req.user };
  }
}
