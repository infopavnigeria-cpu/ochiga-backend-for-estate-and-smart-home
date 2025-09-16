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
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';

@Controller('residents')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

  // 🏡 Add a new resident
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createResident(@Body() dto: CreateResidentDto) {
    return this.residentService.createResident(dto);
  }

  // 📋 Get list of all residents
  @Get()
  getAllResidents() {
    return this.residentService.getAllResidents();
  }

  // 🔍 Get details of a specific resident
  @Get(':id')
  getResidentById(@Param('id') id: string) {
    return this.residentService.getResidentById(id);
  }

  // 🛠 Update resident details
  @Patch(':id')
  updateResident(
    @Param('id') id: string,
    @Body() dto: UpdateResidentDto,
  ) {
    return this.residentService.updateResident(id, dto);
  }

  // ❌ Remove a resident
  @Delete(':id')
  removeResident(@Param('id') id: string) {
    return this.residentService.removeResident(id);
  }
}
