import { Controller, Request, Post, UseGuards, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/schema/user.schema';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req: { user: User }) {
    Logger.log('Auth/login login method');
    console.log('req.user :>> ', req.user);
    return this.authService.login(req.user);
  }
}
