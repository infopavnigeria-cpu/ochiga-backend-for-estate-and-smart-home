import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret', // ✅ consistent secret
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard, // ✅ now registered
    RolesGuard,   // ✅ now registered
  ],
  exports: [AuthService, JwtModule, JwtAuthGuard, RolesGuard], // ✅ export guards if needed
})
export class AuthModule {}
