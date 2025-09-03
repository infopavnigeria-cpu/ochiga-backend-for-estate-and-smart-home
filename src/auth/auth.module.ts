// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule, // <-- needed for @UseGuards(AuthGuard)
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret', // better than hardcoding
      signOptions: { expiresIn: '1d' }, // 1 day
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <-- add JwtStrategy here
  exports: [AuthService],
})
export class AuthModule {}
