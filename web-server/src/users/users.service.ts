import { Injectable, Logger } from '@nestjs/common';
import uuid from '../utils/uuid';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(userId: string): Promise<User> {
    Logger.log('-----------------> getUserById service <--------------------');
    return this.usersRepository.findOne({ userId });
  }

  async getUserByEmail(email: string): Promise<User> {
    Logger.log(
      '-----------------> getUserByEmail service <--------------------',
    );
    return this.usersRepository.findOne({ email });
  }

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async createUser(user: CreateUserDto): Promise<User> {
    Logger.log('-----------------> createUser service <--------------------');
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
    user.createddAt = new Date();
    user.password = hashedPassword;

    return this.usersRepository.create({
      userId: uuid(),
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
