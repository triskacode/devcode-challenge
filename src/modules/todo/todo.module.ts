import { CacheModule, Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { TodoRepository } from './todo.repository';

@Module({
  imports: [
    CacheModule.register({
      max: 500,
    }),
    TypeOrmModule.forFeature([Todo]),
    ActivityModule,
  ],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
})
export class TodoModule {}
