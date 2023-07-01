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
import { FastifyReply } from 'fastify';
import * as bcrypt from 'bcrypt';
import constants from './constants/index';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

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

  isValidRefreshToken(
    refreshTokenFromDB: string,
    refreshTokenFromCookie: string,
  ): boolean {
    return refreshTokenFromDB === refreshTokenFromCookie;
  }

  async refreshToken(reply: FastifyReply) {
    Logger.log('-----------------> refreshToken service <--------------------');

    // get refresh token id from the cookie
    // get the refresh token from redis
    // validate if the refresh token is valid
    // if the refresh token valid -> create a new refresh token and access token and
    // send back to client's cookie
  }

  async signIn(user: Partial<User>, response: FastifyReply) {
    Logger.log('-----------------> signIn <--------------------');

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

    let cachedCounterForAccesstoken: string = await this.cacheManager.get(
      'counter_for_access_token',
    );
    let cachedCounterForRefreshToken: string = await this.cacheManager.get(
      'counter_for_refresh_token',
    );

    await this.cacheManager.set(
      'counter_for_access_token',
      cachedCounterForAccesstoken + 1,
    );

    await this.cacheManager.set(
      'counter_for_refresh_token',
      cachedCounterForRefreshToken + 1,
    );

    console.log('counter_for_access_token :>> ', cachedCounterForAccesstoken);
    console.log('counter_for_refresh_token :>> ', cachedCounterForRefreshToken);

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    await this.cacheManager.set(
      `jwt_access_token_id_${cachedCounterForAccesstoken + 1}`,
      accessToken,
      { ttl: constants.ONE_HOUR_IN_MILISECONDS },
    );
    await this.cacheManager.set(
      `jwt_refresh_token_id_${cachedCounterForRefreshToken + 1}`,
      refreshToken,
      { ttl: constants.SEVEN_DAYS_IN_MILISECONDS },
    );

    const accessTokenKey = 'jwt_access_token_id';
    const refreshTokenKey = 'jwt_refresh_token_id';

    this.setCookie(response, accessTokenKey, cachedCounterForAccesstoken + 1);
    this.setCookie(response, refreshTokenKey, cachedCounterForRefreshToken + 1);

    // Only show for testing
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
