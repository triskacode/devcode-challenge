import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async create(entity: Todo): Promise<Todo> {
    const insertResult = await this.repository.insert(entity);

    return {
      ...entity,
      ...insertResult.generatedMaps[0],
      activity_group_id: entity.activity.id,
    };
  }

  async update(entity: Todo, updateSet: Partial<Todo>): Promise<Todo> {
    const updateResult = await this.repository.update(
      { id: entity.id },
      { ...entity, ...updateSet },
    );

    if (!updateResult.affected)
      throw new InternalServerErrorException('Cannot update todos');

    return { ...entity, ...updateSet };
  }

  async delete(id: Todo['id']): Promise<boolean> {
    const deleteResult = await this.repository.delete({ id });

    return !!deleteResult.affected;
  }

  async findBy(where?: Partial<Todo>): Promise<Todo[]> {
    const query = this.queryBuilder
      .where(where ?? {})
      .limit(10)
      .cache(5000);

    return await query.getMany();
  }

  async findById(id: Todo['id']): Promise<Todo> {
    const query = this.queryBuilder.where({ id });

    return await query.getOne();
  }
}
