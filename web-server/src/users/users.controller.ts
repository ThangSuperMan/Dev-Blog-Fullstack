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

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    Logger.log('UsersController create new user');
    const updatedAt: Date = new Date();
    createUserDto.createddAt = updatedAt;
    return await this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  async update(@Body('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    Logger.log('UserController update todo');
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
