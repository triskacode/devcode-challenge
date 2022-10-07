import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

      if (!activity)
        throw new BadRequestException(
          'activity_group_id must reference id on activity',
        );

      const todo = new Todo();
      todo.title = createTodoDto.title;
      todo.activity = activity;

      return await this.todosRepository.create(todo);
    } catch (err) {
      throw err;
    }
  }

  async findBy(filter: FilterGetTodoDto) {
    try {
      return await this.todosRepository.findBy(filter);
    } catch (err) {
      throw err;
    }
  }

  async findById(id: number) {
    try {
      const todo = await this.todosRepository.findById(id);

      if (!todo) throw new NotFoundException(`Todo with ID ${id} Not Found`);

      return todo;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    try {
      const todo = await this.todosRepository.findById(id);

      if (!todo) throw new NotFoundException(`Todo with ID ${id} Not Found`);

      if (updateTodoDto.activity_group_id) {
        const activity = await this.activitiesRepository.findById(
          updateTodoDto.activity_group_id,
        );

        if (!activity)
          throw new BadRequestException(
            'activity_group_id must reference id on activity',
          );

        todo.activity = activity;
      }

      return await this.todosRepository.update(todo, updateTodoDto);
    } catch (err) {
      throw err;
    }
  }

  async remove(id: number) {
    try {
      const deleteResult = await this.todosRepository.delete(id);

      if (!deleteResult)
        throw new NotFoundException(`Todo with ID ${id} Not Found`);

      return {};
    } catch (err) {
      throw err;
    }
  }
}
