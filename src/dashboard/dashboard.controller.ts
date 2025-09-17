import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../enums/user-role.enum';
import { TokenUser } from '../auth/types/token-user.interface';
import { DashboardService } from './dashboard.service';

interface AuthenticatedRequest extends Request {
  user: TokenUser;
}

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  getManagerDashboard(@Request() req: AuthenticatedRequest) {
    return this.dashboardService.getManagerDashboard(req.user);
  }

  @Get('resident')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESIDENT)
  getResidentDashboard(@Request() req: AuthenticatedRequest) {
    return this.dashboardService.getResidentDashboard(req.user);
  }
}
