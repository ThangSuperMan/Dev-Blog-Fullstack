import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuard as AuthGuardCommon } from './guards/auth.guard';
import { SignInDto } from './interfaces/signin-dto.interface';
import { User } from 'src/users/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {
    return 'google login';
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any) {
    return this.authService.googleLogin(req);
  }

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.createUser(createUserDto);
    return result;
  }

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<{ access_token: string }> {
    Logger.log('auth/signIn signIn method');
    const user: Partial<User> = {
      email: signInDto.email,
      password: signInDto.password,
    };

    return this.authService.signIn(user, response);
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: any): Promise<any> {
    console.log('req. :>> ', req.user);
    return {
      statusCode: HttpStatus.OK,
      user: req.user,
    };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    this.authService.refreshToken(req, reply);
  }

  @UseGuards(AuthGuardCommon)
  @Get('profile')
  getProfile(@Request() req: any): any {
    Logger.log('getProfile');
    return req.user;
  }
}
