import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Resident } from './entities/resident.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getProfile(@Param('id') id: number): Promise<Resident> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: number,
    @Body() updateData: Partial<Resident>
  ): Promise<Resident> {
    return this.userService.update(id, updateData);
  }
}
