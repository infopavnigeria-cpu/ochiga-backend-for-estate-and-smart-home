import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { VisitorsService } from './visitors.service';
import { Visitor } from './visitors.entity';

@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  async create(@Body() dto: Partial<Visitor>) {
    return this.visitorsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.visitorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.visitorsService.findOne(id);
  }
}
