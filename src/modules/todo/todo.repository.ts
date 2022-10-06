import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoRepository {
  private queryBuilder: SelectQueryBuilder<Todo>;

  constructor(
    @InjectRepository(Todo)
    private repository: Repository<Todo>,
  ) {
    this.queryBuilder = repository.createQueryBuilder('todo');
  }

  async create(entity: Todo) {
    return await this.repository.save(entity);
  }

  async update(entity: Todo, updateSet: Partial<Todo>) {
    return await this.repository.save({ ...entity, ...updateSet });
  }

  async delete(entity: Todo) {
    return await this.repository.remove(entity);
  }

  async findBy(where?: Partial<Todo>) {
    const query = this.queryBuilder.where(where ?? {});

    return query.getMany();
  }

  async findById(id: Todo['id']) {
    const query = this.queryBuilder.where({ id });

    return query.getOne();
  }
}
