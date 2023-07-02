import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  private extractJwtIdFromCookie(request: Request): string {
    const cookie = request.cookies.jwt_id;
    return cookie;
  }

  private async getAccessTokenBasedOnJwtId(jwtId: string): Promise<string> {
    const accessToken: string = await this.cacheManager.get(`jwt_id_${jwtId}`);
    return accessToken;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtId = this.extractJwtIdFromCookie(request);
    const token = await this.getAccessTokenBasedOnJwtId(jwtId);

    if (!jwtId || !token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
