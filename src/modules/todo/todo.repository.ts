import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { isObject } from 'class-validator';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoRepository {
  private queryBuilder: SelectQueryBuilder<Todo>;
  private logger = new Logger(TodoRepository.name);

  private cacheKey = {
    FIND_BY: 'findBy',
    FIND_BY_ID: 'findById',
  };

  constructor(
    @InjectRepository(Todo)
    private repository: Repository<Todo>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.queryBuilder = repository.createQueryBuilder('todo');
  }

  async create(entity: Todo): Promise<Todo> {
    const insertResult = await this.repository.insert(entity);

    this.clearCache();

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

    this.clearCache();

    return { ...entity, ...updateSet };
  }

  async delete(id: Todo['id']): Promise<boolean> {
    const deleteResult = await this.repository.delete({ id });

    this.clearCache();

    return !!deleteResult.affected;
  }

  async findBy(where?: Partial<Todo>): Promise<Todo[]> {
    const cacheKey = this.getCacheKey(this.cacheKey.FIND_BY, where);
    const cache = (await this.cacheManager.get(cacheKey)) as Todo[];

    if (cache) return cache;

    const todos = await this.queryBuilder
      .where(where ?? {})
      .limit(10)
      .getMany();

    this.cacheManager.set(cacheKey, todos, { ttl: 60 });

    return todos;
  }

  async findById(id: Todo['id']): Promise<Todo> {
    const cacheKey = this.getCacheKey(this.cacheKey.FIND_BY_ID, id.toString());
    const cache = (await this.cacheManager.get(cacheKey)) as Todo;

    if (cache) return cache;

    const todo = await this.queryBuilder.where({ id }).getOne();

    this.cacheManager.set(cacheKey, todo, { ttl: 60 });

    return todo;
  }

  private getCacheKey(methodName: string, keys?: string | Record<string, any>) {
    const className = TodoRepository.name;

    const keyStr = keys
      ? '?' + isObject(keys)
        ? Object.keys(keys)
            .map((key) => `${key}=${keys[key]}`)
            .join(',')
        : `key=${keys}`
      : '';

    return `${className}-${methodName}${keyStr}`;
  }

  private async clearCache() {
    const keys = (await this.cacheManager.store.keys()) as string[];

    await keys
      .filter((key) => key.match(new RegExp(TodoRepository.name, 'g')))
      .map(async (key) => {
        await this.cacheManager.del(key);
      });
  }
}
