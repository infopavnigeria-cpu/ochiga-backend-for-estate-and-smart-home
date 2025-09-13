import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../user/entities/user.entity';

@Controller('dashboard')
export class DashboardController {
  @Get('manager')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Manager)
  getManagerDashboard(@Request() req) {
    return { message: 'Welcome Manager!', user: req.user };
  }

  @Get('resident')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Resident)
  getResidentDashboard(@Request() req) {
    return { message: 'Welcome Resident!', user: req.user };
  }
}
