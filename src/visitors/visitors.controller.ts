// src/visitors/visitor.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { VisitorsService } from './visitor.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateVisitorDto, @Req() req: Request) {
    const user = req.user as User; // ✅ injected by JWT strategy
    return this.visitorsService.create(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findMyVisitors(@Req() req: Request) {
    const user = req.user as User;
    return this.visitorsService.findByUser(user.id);
  }
}
