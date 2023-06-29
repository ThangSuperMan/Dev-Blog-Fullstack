import {
  Logger,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async index() {
    return await this.usersService.getUsers();
  }

  @Get(':userId')
  async find(@Param('userId') userId: string) {
    Logger.log('UsersController find user by id');
    Logger.warn('userId :>> ', userId);
    return this.usersService.getUserById(userId);
  }

  // @Post('/signup')
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   Logger.log('UsersController createUser method');
  //   const saltOrRounds = 10;
  //   const hashedPassword = await bcrypt.hash(
  //     createUserDto.password,
  //     saltOrRounds,
  //   );

  //   createUserDto.createddAt = new Date();
  //   createUserDto.password = hashedPassword;

  //   const result = await this.usersService.createUser(createUserDto);
  //   return result;
  // }

  @Put(':id')
  async update(@Body('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    Logger.log('UserController update user');
    const currentTime: Date = new Date();
    updateUserDto.updatedAt = currentTime;
    return await this.usersService.updateUser(id, updateUserDto);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   Logger.log('UserController delete new todo');
  //   return await this.usersService.(id);
  // }
}
