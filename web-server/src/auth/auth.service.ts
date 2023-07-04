import {
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './interfaces/auth-payload.interface';
import { User } from 'src/users/schema/user.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as bcrypt from 'bcrypt';
import constants from './constants/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  googleLogin(req: any) {
    Logger.log('-----------------> googleLogin service <--------------------');
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async validateUser(email: string, password: string): Promise<User> | null {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new NotAcceptableException('Could not find the user');
    }

    const passwordIsValid: boolean = await this.comparePassword(
      password,
      user.password,
    );

    if (user && passwordIsValid) return user;
    return null;
  }

  async comparePassword(
    password: string,
    storePasswordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, storePasswordHash);
  }

  setCookie(reply: FastifyReply, cookieKey: string, cachedCounter: string) {
    reply.setCookie(cookieKey, cachedCounter, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    });
  }

  async getCachedCounterJwtAccessAndRefreshToken(): Promise<{
    cachedCounterForAccesstoken: string;
    cachedCounterForRefreshtoken: string;
  }> {
    const cachedCounterForAccesstoken: string = await this.cacheManager.get(
      'counter_for_access_token',
    );
    const cachedCounterForRefreshToken: string = await this.cacheManager.get(
      'counter_for_refresh_token',
    );

    return {
      cachedCounterForAccesstoken: cachedCounterForAccesstoken,
      cachedCounterForRefreshtoken: cachedCounterForRefreshToken,
    };
  }

  async setCachedCounterJwtAccessAndRefreshToken() {
    const { cachedCounterForAccesstoken, cachedCounterForRefreshtoken } =
      await this.getCachedCounterJwtAccessAndRefreshToken();

    await this.cacheManager.set(
      'counter_for_access_token',
      cachedCounterForAccesstoken + 1,
    );
    await this.cacheManager.set(
      'counter_for_refresh_token',
      cachedCounterForRefreshtoken + 1,
    );
  }

  async setJwtAccessTokenAndRefreshTokenForRedis(
    accessToken: string,
    refreshToken: string,
  ) {
    const { cachedCounterForAccesstoken, cachedCounterForRefreshtoken } =
      await this.getCachedCounterJwtAccessAndRefreshToken();

    this.setCachedCounterJwtAccessAndRefreshToken();

    await this.cacheManager.set(
      `jwt_access_token_id_${cachedCounterForAccesstoken + 1}`,
      accessToken,
      { ttl: constants.ONE_HOUR_IN_MILISECONDS },
    );
    await this.cacheManager.set(
      `jwt_refresh_token_id_${cachedCounterForRefreshtoken + 1}`,
      refreshToken,
      { ttl: constants.SEVEN_DAYS_IN_MILISECONDS },
    );
  }

  async refreshToken(req: FastifyRequest, reply: FastifyReply) {
    Logger.log('-----------------> refreshToken service <--------------------');

    const jwtRefreshTokenId = req.cookies['jwt_refresh_token_id'];
    const refreshTokenFromRedis: string = await this.cacheManager.get(
      `jwt_refresh_token_id_${jwtRefreshTokenId}`,
    );

    let payload: any;

    try {
      payload = await this.jwtService.verifyAsync(refreshTokenFromRedis, {
        secret: process.env.JWT_SECRET_KEY,
      });
      const user = await this.usersService.getUserByEmail(payload.email);
      payload = {
        sub: user.userId,
        email: user.email,
      };
    } catch (error: any) {
      Logger.error('error :>> ', error);
      reply.status(401).send('Your token is invalid');
    }

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.setJwtAccessTokenAndRefreshTokenForRedis(accessToken, refreshToken);

    const { cachedCounterForAccesstoken, cachedCounterForRefreshtoken } =
      await this.getCachedCounterJwtAccessAndRefreshToken();
    const accessTokenKey = 'jwt_access_token_id';
    const refreshTokenKey = 'jwt_refresh_token_id';
    this.setCookie(reply, accessTokenKey, cachedCounterForAccesstoken + 1);
    this.setCookie(reply, refreshTokenKey, cachedCounterForRefreshtoken + 1);
    this.setCachedCounterJwtAccessAndRefreshToken();

    reply
      .status(200)
      .send(
        'You token is valid, now you can receive from us the new access token and refresh token',
      );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signIn(user: Partial<User>, reply: FastifyReply) {
    Logger.log('-----------------> signIn service <--------------------');

    const payload: AuthPayload = {
      email: user.email,
      sub: user.userId,
    };
    const userFromDB = await this.usersService.getUserByEmail(user.email);

    if (!user) {
      throw new NotAcceptableException('Could not find the user');
    }

    const passwordIsValid: boolean = await bcrypt.compare(
      user.password,
      userFromDB.password,
    );

    if (!passwordIsValid) throw new UnauthorizedException();

    const cachedCounterForAccesstoken: string = await this.cacheManager.get(
      'counter_for_access_token',
    );
    const cachedCounterForRefreshToken: string = await this.cacheManager.get(
      'counter_for_refresh_token',
    );

    this.setCachedCounterJwtAccessAndRefreshToken();
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    this.setJwtAccessTokenAndRefreshTokenForRedis(accessToken, refreshToken);

    const accessTokenKey = 'jwt_access_token_id';
    const refreshTokenKey = 'jwt_refresh_token_id';
    this.setCookie(reply, accessTokenKey, cachedCounterForAccesstoken + 1);
    this.setCookie(reply, refreshTokenKey, cachedCounterForRefreshToken + 1);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
