import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { SignInDto } from './interfaces/signin-dto.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('')
  index() {
    return 'Hello from auth route';
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

  @Post('refresh')
  async refreshToken(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    this.authService.refreshToken(req, reply);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any): any {
    Logger.log('getProfile');
    return req.user;
  }
}
