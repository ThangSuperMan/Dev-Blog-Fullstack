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
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

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

  setCookie(response: Response, cachedCounter: string) {
    response.cookie('jwt_id', cachedCounter + 1, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    });
  }

  async signIn(user: Partial<User>, response: Response) {
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

    // const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const cachedCounter: string = await this.cacheManager.get('counter');
    await this.cacheManager.set('counter', `${cachedCounter + 1}`);
    const accessToken = this.jwtService.sign(payload);
    await this.cacheManager.set(`jwt_id_${cachedCounter + 1}`, accessToken);

    this.setCookie(response, cachedCounter);

    return {
      access_token: accessToken,
    };
  }
}
