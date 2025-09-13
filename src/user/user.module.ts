// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 👈 Gives UserModule access to User table
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 👈 So AuthModule (and others) can reuse UserService
})
export class UserModule {}
