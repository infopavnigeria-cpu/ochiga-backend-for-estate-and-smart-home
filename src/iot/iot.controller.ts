// src/iot/iot.controller.ts
import {
  Controller, Get, Post, Param, Body, UseGuards, Request
} from '@nestjs/common';
import { IotService } from './iot.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../enums/user-role.enum';
import { TokenUser } from '../auth/types/token-user.interface';
import { ControlDeviceDto } from './dto/control-device.dto';
import { CreateDeviceDto } from './dto/create-device.dto';

interface AuthenticatedRequest extends Request {
  user: TokenUser;
}

@Controller('iot')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Get('my-devices')
  @Roles(UserRole.RESIDENT)
  getMyDevices(@Request() req: AuthenticatedRequest) {
    return this.iotService.findUserDevices(req.user.id);
  }

  @Get('estate-devices')
  @Roles(UserRole.MANAGER)
  getEstateDevices() {
    return this.iotService.findEstateDevices();
  }

  @Post('devices')
  @Roles(UserRole.RESIDENT, UserRole.MANAGER)
  createDevice(@Request() req: AuthenticatedRequest, @Body() dto: CreateDeviceDto) {
    return this.iotService.createDevice(req.user.id, req.user.role, dto);
  }

  @Post('devices/:id/control')
  @Roles(UserRole.RESIDENT, UserRole.MANAGER)
  controlDevice(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: ControlDeviceDto,
  ) {
    return this.iotService.controlDevice(req.user.id, req.user.role, id, dto);
  }

  @Get('devices/:id/logs')
  @Roles(UserRole.RESIDENT, UserRole.MANAGER)
  getDeviceLogs(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.iotService.getDeviceLogs(req.user.id, req.user.role, id);
  }
}
