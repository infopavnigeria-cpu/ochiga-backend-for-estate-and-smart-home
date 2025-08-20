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
import { Request } from 'express'; // ✅ add this

@Controller('homes')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: Request, @Body() dto: CreateHomeDto) {
    return this.homeService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.homeService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.homeService.findOne(req.user.id, +id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateHomeDto) {
    return this.homeService.update(req.user.id, +id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.homeService.remove(req.user.id, +id);
  }
}