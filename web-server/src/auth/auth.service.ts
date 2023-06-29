import {
  Injectable,
  Logger,
  NotAcceptableException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
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

  async signIn(user: Partial<User>, response: Response) {
    Logger.log('signIn');
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

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Set cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    });

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
