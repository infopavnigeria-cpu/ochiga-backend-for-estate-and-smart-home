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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateResidentDto) {
    return this.residentService.createResident(dto);
  }

  @Get()
  findAll() {
    return this.residentService.getAllResidents();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residentService.getResidentById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResidentDto) {
    return this.residentService.updateResident(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residentService.removeResident(id);
  }
}
