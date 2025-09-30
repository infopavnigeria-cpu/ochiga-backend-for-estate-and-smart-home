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

  // --- Existing register endpoint (kept as-is) ---
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  // --- Login (kept behavior) ---
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const auth = await this.authService.login(loginDto);

    const refresh = await this.tokenService.generateRefreshToken(auth.user.id, 'web');

    // set http-only cookie for refresh token - preserve your previous behavior
    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: (process.env.COOKIE_SAME_SITE as any) || 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    // Return the same shape the frontend expects
    return {
      success: true,
      message: 'Login successful',
      token: auth.token,
      user: auth.user,
    };
  }

  // --- Invite resident (protected - managers only) ---
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.MANAGER)
  @Post('invite-resident')
  async inviteResident(@Req() req: Request, @Body() body: { email: string; estate: string; house: string; name?: string }) {
    // manager-only endpoint: ensure manager is inviting into their estate
    const manager = req.user as any;
    if (!manager) throw new UnauthorizedException();

    // optional: enforce manager.estate === body.estate
    if (manager.role !== UserRole.MANAGER) throw new ForbiddenException('Only managers can invite residents');

    const { email, estate, house, name } = body;
    // Minimal validation (your DTO approach can be added)
    if (!email || !estate || !house) {
      return { success: false, message: 'email, estate and house are required' };
    }

    // create stateless invite token
    const inviteToken = this.tokenService.generateInviteToken({ email, estate, house, name });

    // TODO: in prod: send email to invitee with inviteToken link
    // For now, return token to caller (manager). This matches many admin flows where invite token is returned.
    return {
      success: true,
      message: `Invite token generated for ${email}`,
      inviteToken,
    };
  }

  // --- Register resident from invite (public) ---
  @Public()
  @Post('register-resident')
  @HttpCode(HttpStatus.CREATED)
  async registerResident(
    @Body() body: { inviteToken: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { inviteToken, password } = body;
    if (!inviteToken || !password) {
      return { success: false, message: 'inviteToken and password are required' };
    }

    const payload = await this.tokenService.validateInviteToken(inviteToken);
    if (!payload) {
      return { success: false, message: 'Invalid or expired invite token' };
    }

    // If a user already exists with that email, return useful message
    const existing = await this.userService.findByEmail(payload.email);
    if (existing) {
      return { success: false, message: 'Account already exists for this email' };
    }

    // Build RegisterDto using invite payload (name optional)
    const registerDto: RegisterDto = {
      name: payload.name ?? payload.email.split('@')[0],
      email: payload.email,
      password,
      role: UserRole.RESIDENT,
      estate: payload.estate,
      house: payload.house,
    };

    // Reuse your AuthService.register (it already hashes password & issues token)
    const authResp = await this.authService.register(registerDto);

    // Generate refresh token and set cookie (same behavior as login)
    const refresh = await this.tokenService.generateRefreshToken(authResp.user.id, 'web');
    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: (process.env.COOKIE_SAME_SITE as any) || 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return {
      success: true,
      message: 'Registration successful',
      token: authResp.token,
      user: authResp.user,
    };
  }

  // --- Refresh (kept as-is but adapted shape) ---
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = (req as any).cookies?.refreshToken || req.cookies?.refreshToken;
    if (!raw) return res.status(401).json({ message: 'No refresh token' });

    const row = await this.tokenService.validateRefreshTokenByRaw(raw);
    if (!row) return res.status(401).json({ message: 'Invalid refresh token' });

    const user = await this.authService.findById(row.userId);
    if (!user) {
      await this.tokenService.revoke(row);
      res.clearCookie('refreshToken');
      return res.status(401).json({ message: 'Invalid token' });
    }

    const accessToken = this.authService.generateJwt(user);

    await this.tokenService.revoke(row);
    const newRaw = await this.tokenService.generateRefreshToken(user.id, 'web');

    res.cookie('refreshToken', newRaw, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: (process.env.COOKIE_SAME_SITE as any) || 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return { token: accessToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  // --- Logout (kept but shape preserved) ---
  @ApiBearerAuth('access-token')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = (req as any).cookies?.refreshToken || req.cookies?.refreshToken;
    if (raw) {
      const row = await this.tokenService.validateRefreshTokenByRaw(raw);
      if (row) await this.tokenService.revoke(row);
    }
    res.clearCookie('refreshToken');
    return { message: 'Logout successful' };
  }

  // --- Me (profile) endpoint, protected ---
  @ApiBearerAuth('access-token')
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const userPayload = (req as any).user;
    if (!userPayload) throw new UnauthorizedException();

    const user = await this.authService.findById(userPayload.id);
    if (!user) throw new UnauthorizedException();

    // return full user object you want on frontend
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      estate: (user as any).estate ?? null,
      house: (user as any).house ?? null,
    };
  }
}
