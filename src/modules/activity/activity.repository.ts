import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivityRepository {
  private queryBuilder: SelectQueryBuilder<Activity>;
  private logger = new Logger(ActivityRepository.name);

  private cacheKey = {
    FIND_BY: 'findBy',
    FIND_BY_ID: 'findById',
  };

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.queryBuilder = repository.createQueryBuilder('activity');
  }

  async create(entity: Activity): Promise<Activity> {
    const insertResult = await this.repository.insert(entity);

    this.clearCache();

    return { ...entity, ...insertResult.generatedMaps[0] };
  }

  async update(
    entity: Activity,
    updateSet: Partial<Activity>,
  ): Promise<Activity> {
    const updateResult = await this.repository.update(
      { id: entity.id },
      { ...entity, ...updateSet },
    );

    if (!updateResult.affected)
      throw new InternalServerErrorException('Cannot update activities');

    this.clearCache();

    return { ...entity, ...updateSet };
  }

  async delete(id: Activity['id']): Promise<boolean> {
    const deleteResult = await this.repository.delete({ id });

    this.clearCache();

    return !!deleteResult.affected;
  }

  async findBy(where?: Partial<Activity>): Promise<Activity[]> {
    const cacheKey = this.getCacheKey(this.cacheKey.FIND_BY, where);
    const cache = (await this.cacheManager.get(cacheKey)) as Activity[];

    if (cache) return cache;

    const activities = await this.queryBuilder
      .where(where ?? {})
      .limit(10)
      .getMany();

    this.cacheManager.set(cacheKey, activities, { ttl: 60 });

    return activities;
  }

  async findById(id: Activity['id']): Promise<Activity> {
    const cacheKey = this.getCacheKey(this.cacheKey.FIND_BY_ID, id.toString());
    const cache = (await this.cacheManager.get(cacheKey)) as Activity;

    if (cache) return cache;

    const activity = await this.queryBuilder.where({ id }).getOne();

    this.cacheManager.set(cacheKey, activity, { ttl: 60 });

    return activity;
  }

  private getCacheKey(methodName: string, keys?: string | Record<string, any>) {
    const className = ActivityRepository.name;

    const keyStr = keys
      ? typeof keys === 'string'
        ? `key=${keys}`
        : Object.keys(keys)
            .map((key) => `${key}=${keys[key]}`)
            .join(',')
      : '';

    return `${className}-${methodName}${keyStr ? `?${keyStr}` : ''}`;
  }

  private async clearCache() {
    const keys = (await this.cacheManager.store.keys()) as string[];

    await keys
      .filter((key) => key.match(new RegExp(ActivityRepository.name, 'g')))
      .map(async (key) => {
        await this.cacheManager.del(key);
      });
  }
}
