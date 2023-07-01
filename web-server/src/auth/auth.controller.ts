import {
  Controller,
  Post,
  UseGuards,
  Logger,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { User } from 'src/users/schema/user.schema';
import { FastifyReply } from 'fastify';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
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

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    // TODO: Need to refactor this block to service
    Logger.log('signUp method');
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    createUserDto.createddAt = new Date();
    createUserDto.password = hashedPassword;

    const result = await this.usersService.createUser(createUserDto);
    return result;
  }

  @HttpCode(HttpStatus.OK)
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
  async refreshToken(@Res({ passthrough: true }) reply: FastifyReply) {
    this.authService.refreshToken(reply);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any): any {
    Logger.log('getProfile');
    return req.user;
  }
}
