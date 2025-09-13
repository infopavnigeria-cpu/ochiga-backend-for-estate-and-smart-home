// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm'; // 👈 import TypeOrmModule
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../user/entities/user.entity'; // 👈 import User entity
import { UserModule } from '../user/user.module'; // 👈 import UserModule

@Module({
  imports: [
    PassportModule, 
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]), // 👈 gives access to User repository
    UserModule, // 👈 so AuthService can call UserService
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
