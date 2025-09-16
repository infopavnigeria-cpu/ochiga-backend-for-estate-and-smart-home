// src/auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new UnauthorizedException("No token provided");

    const token = authHeader.split(" ")[1];
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
