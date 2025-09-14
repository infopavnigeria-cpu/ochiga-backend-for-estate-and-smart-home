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
import { EstateService } from './estate.service';
import { CreateEstateDto } from './dto/create-estate.dto';
import { UpdateEstateDto } from './dto/update-estate.dto';
import { Estate } from './entities/estate.entity';

@Controller('estates')
export class EstateController {
  constructor(private readonly estateService: EstateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEstateDto: CreateEstateDto): Promise<Estate> {
    return this.estateService.create(createEstateDto);
  }

  @Get()
  async findAll(): Promise<Estate[]> {
    return this.estateService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Estate> {
    return this.estateService.findOne(id); // ✅ id stays string
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEstateDto: UpdateEstateDto,
  ): Promise<Estate> {
    return this.estateService.update(id, updateEstateDto); // ✅ id stays string
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.estateService.remove(id); // ✅ id stays string
  }
}
