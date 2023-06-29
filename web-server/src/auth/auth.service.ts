import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schema/user.schema';

interface IPayload {
  email: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private JwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> | null {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotAcceptableException('Could not find the user');
    }
    const passwordIsValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (user && passwordIsValid) return user;
    return null;
  }

  async login(user: User) {
    console.log('login');
    const payload: IPayload = {
      email: user.email,
      sub: user.userId,
    };
    return {
      access_token: this.JwtService.sign(payload),
    };
  }
}
