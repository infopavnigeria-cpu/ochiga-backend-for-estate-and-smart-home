// src/home/home.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { Request } from 'express';

@Controller('homes')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  /** Manager creates a home and assigns a resident */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: Request, @Body() dto: CreateHomeDto) {
    const managerId = (req as any).user?.id ?? '1'; // ✅ manager ID from auth
    return this.homeService.create(managerId, dto);
  }

  /** Resident fetches all their homes */
  @Get()
  findAll(@Req() req: Request) {
    const userId = (req as any).user?.id ?? '1';
    return this.homeService.findAll(userId);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user?.id ?? '1';
    return this.homeService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateHomeDto,
  ) {
    const userId = (req as any).user?.id ?? '1';
    return this.homeService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = (req as any).user?.id ?? '1';
    return this.homeService.remove(userId, id);
  }
}
