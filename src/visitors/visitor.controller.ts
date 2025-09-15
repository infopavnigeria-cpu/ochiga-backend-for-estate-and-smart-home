import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VisitorService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';

@Controller('visitors')
@UseGuards(JwtAuthGuard)
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  create(@Body() dto: CreateVisitorDto, @Request() req) {
    return this.visitorService.create(dto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.visitorService.findAllByUser(req.user.userId);
  }

  @Patch(':code/status')
  updateStatus(@Param('code') code: string, @Body('status') status: string) {
    return this.visitorService.updateStatus(code, status);
  }
}
