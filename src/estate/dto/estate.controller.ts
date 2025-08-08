import { Controller, Get, Post, Body } from '@nestjs/common';
import { EstateService } from './estate.service';
import { CreateEstateDto } from './dto/create-estate.dto';
import { Estate } from './estate.entity';

@Controller('estate')
export class EstateController {
  constructor(private readonly estateService: EstateService) {}

  @Post()
  create(@Body() dto: CreateEstateDto): Estate {
    return this.estateService.create(dto);
  }

  @Get()
  findAll(): Estate[] {
    return this.estateService.findAll();
  }
}
