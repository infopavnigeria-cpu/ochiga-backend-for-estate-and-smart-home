// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  Get,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Public } from './decorators/public.decorator';
import { TokenService } from './token.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { UserService } from '../user/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const auth = await this.authService.login(loginDto);

    const refresh = await this.tokenService.generateRefreshToken(auth.user.id, 'web');

    // stricter cookie flags in production (but allow override via env if needed)
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd || process.env.COOKIE_SECURE === 'true';
    const sameSiteValue = isProd ? 'strict' : ((process.env.COOKIE_SAME_SITE as any) || 'lax');

    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: sameSiteValue,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return {
      success: true,
      message: 'Login successful',
      token: auth.token,
      user: auth.user,
    };
  }

  // other endpoints (invite, register-resident, refresh, logout, me)
  // keep the implementations you already have (I provided a safe version earlier).
  // For brevity, reuse the controller file you already installed that includes those routes.
}
