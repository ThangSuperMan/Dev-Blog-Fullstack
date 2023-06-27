import {
  Logger,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly service: TodoService) {}

  @Get()
  async index() {
    return await this.service.findAll();
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    Logger.log('TodoController find todo by id');
    return await this.service.findOne(id);
  }

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    Logger.log('TodoController create new todo');
    return await this.service.create(createTodoDto);
  }

  @Put(':id')
  async update(@Body('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    Logger.log('TodoController update todo');
    return await this.service.update(id, updateTodoDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    Logger.log('TodoController delete new todo');
    return await this.service.delete(id);
  }
}
