import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ActivityRepository } from 'src/modules/activity/activity.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { FilterGetTodoDto } from './dto/filter-get-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoRepository } from './todo.repository';

@Injectable()
export class TodoService {
  constructor(
    private readonly todosRepository: TodoRepository,
    private readonly activitiesRepository: ActivityRepository,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    try {
      const activity = await this.activitiesRepository.findById(
        createTodoDto.activity_group_id,
      );

      const todo = new Todo();
      todo.title = createTodoDto.title;
      todo.activity = activity;

      return await this.todosRepository.create(todo);
    } catch (err) {
      Logger.error(err.message, 'TodoService - create');

      throw err;
    }
  }

  async findBy(filter: FilterGetTodoDto) {
    try {
      return await this.todosRepository.findBy(filter);
    } catch (err) {
      Logger.error(err.message, 'TodoService - findBy');

      throw err;
    }
  }

  async findById(id: number) {
    try {
      const todo = await this.todosRepository.findById(id);

      if (!todo) throw new NotFoundException(`Todo with ID ${id} Not Found`);

      return todo;
    } catch (err) {
      Logger.error(err.message, 'TodoService - findById');

      throw err;
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    try {
      const todo = await this.todosRepository.findById(id);

      if (!todo) throw new NotFoundException(`Todo with ID ${id} Not Found`);

      return await this.todosRepository.update(todo, updateTodoDto);
    } catch (err) {
      Logger.error(err.message, 'TodoService - update');

      throw err;
    }
  }

  async remove(id: number) {
    try {
      const todo = await this.todosRepository.findById(id);

      if (!todo) throw new NotFoundException(`Todo with ID ${id} Not Found`);

      await this.todosRepository.delete(todo);

      return {};
    } catch (err) {
      Logger.error(err.message, 'TodoService - remove');

      throw err;
    }
  }
}
