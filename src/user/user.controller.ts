// src/user/user.controller.ts
import { Body, Controller, Get, Post, Param, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateResidentDto } from './dto/create-resident.dto';
import { RegisterResidentDto } from './dto/register-resident.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('resident')
  createResident(@Body() createResidentDto: CreateResidentDto) {
    return this.userService.createResident(createResidentDto);
  }

  @Post('register')
  registerResident(@Body() registerDto: RegisterResidentDto) {
    return this.userService.registerResident(registerDto);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(Number(id));
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.userService.updateUser(Number(id), updateData);
  }
}
