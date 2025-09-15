import { Controller, Post, Get, Param, Body, Req, Delete } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { Visitor } from './visitors.entity';
import { Request } from 'express';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: Partial<Visitor>) {
    const user: any = (req as any).user; // assume injected by AuthGuard
    return this.visitorsService.create(user, dto);
  }

  @Get()
  async findAll() {
    return this.visitorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.visitorsService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.visitorsService.remove(id);
  }
}
