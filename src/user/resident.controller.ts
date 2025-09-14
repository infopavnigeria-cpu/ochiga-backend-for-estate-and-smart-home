// src/user/resident.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ResidentService } from './resident.service';
import { Resident } from './entities/resident.entity';

@Controller('residents')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: Partial<Resident>) {
    return this.residentService.create(dto);
  }

  @Get()
  findAll() {
    return this.residentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residentService.findOne(+id); // ✅ convert string param to number
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<Resident>) {
    return this.residentService.update(+id, dto); // ✅ number
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residentService.remove(+id); // ✅ number
  }
}
