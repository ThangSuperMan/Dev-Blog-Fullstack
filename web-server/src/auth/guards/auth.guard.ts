import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

// Middleware
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
    console.log('getAccessTokenBasedOnJwtId');
    const accessToken: string = await this.cacheManager.get(
      `access_token_${jwtId}`,
    );
    return accessToken;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // const token = this.extractTokenFromHeader(request);
    const jwtId = this.extractJwtIdFromCookie(request);
    console.log('jwtId :>> ', jwtId);

    const token = await this.getAccessTokenBasedOnJwtId(jwtId);
    console.log('accessToken  :>> ', token);

    if (!jwtId || !token) {
      Logger.log('We does not have jwtId');
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  // Inject access token from localStorage to the header for requests
  // private extractTokenFromHeader(request: Request): string | undefined {
  //   const [type, token] = request.headers.authorization?.split(' ') ?? [];
  //   return type === 'Bearer' ? token : undefined;
  // }

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //   const token = this.extractTokenFromHeader(request);
  //   if (!token) {
  //     throw new UnauthorizedException();
  //   }
  //   try {
  //     const payload = await this.jwtService.verifyAsync(token, {
  //       secret: process.env.JWT_SECRET,
  //     });

  //     request['user'] = payload;
  //   } catch {
  //     throw new UnauthorizedException();
  //   }
  //   return true;
  // }
}
