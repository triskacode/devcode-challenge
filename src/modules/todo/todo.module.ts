import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { ActivityIdValidator } from './validators/activity-id.validator';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { TodoRepository } from './todo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), ActivityModule],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository, ActivityIdValidator],
})
export class TodoModule {}