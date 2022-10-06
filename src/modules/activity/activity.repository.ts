import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivityRepository {
  private queryBuilder: SelectQueryBuilder<Activity>;

  constructor(
    @InjectRepository(Activity)
    private readonly repository: Repository<Activity>,
  ) {
    this.queryBuilder = repository.createQueryBuilder('activity');
  }

  async create(entity: Activity) {
    return await this.repository.save(entity);
  }

  async update(entity: Activity, updateSet: Partial<Activity>) {
    return await this.repository.save({ ...entity, ...updateSet });
  }

  async delete(entity: Activity) {
    return await this.repository.remove(entity);
  }

  async findBy(where?: Partial<Activity>) {
    const query = this.queryBuilder.where(where ?? {});

    return query.getMany();
  }

  async findById(id: Activity['id']) {
    const query = this.queryBuilder.where({ id });

    return query.getOne();
  }
}
