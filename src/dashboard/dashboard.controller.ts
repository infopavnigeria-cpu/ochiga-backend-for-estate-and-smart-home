import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../enums/user-role.enum';

// Better: Extend Express Request for typing
interface AuthenticatedRequest extends Request {
  user: {
    id: string;   // UUID
    email: string;
    role: UserRole;
  };
}

@Controller('dashboard')
export class DashboardController {
  @Get('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  getManagerDashboard(@Request() req: AuthenticatedRequest) {
    return {
      message: 'Welcome Manager!',
      user: req.user,
    };
  }

  @Get('resident')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESIDENT)
  getResidentDashboard(@Request() req: AuthenticatedRequest) {
    return {
      message: 'Welcome Resident!',
      user: req.user,
    };
  }
}
