// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Resident } from './entities/resident.entity';
import { ResidentController } from './resident.controller';
import { ResidentService } from './resident.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Resident])],
  controllers: [UserController, ResidentController],
  providers: [UserService, ResidentService],
  exports: [UserService, ResidentService],
})
export class UserModule {}
