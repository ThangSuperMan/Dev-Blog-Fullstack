import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(userId: string): Promise<User> {
    Logger.log('UsersService getUserById');
    return this.usersRepository.findOne({ userId });
  }

  async getUserByEmail(email: string): Promise<User> {
    Logger.log('UsersService getUserByEmail');
    return this.usersRepository.findOne({ email });
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return this.usersRepository.create({
      userId: uuidv4(),
      username: user.username,
      email: user.email,
      password: user.password,
      createdAt: user.createddAt,
    });
  }

  async updateUser(
    userId: string,
    userUpdates: Partial<UpdateUserDto>,
  ): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
  }
}
