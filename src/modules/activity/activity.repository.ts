import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async create(entity: Activity): Promise<Activity> {
    const insertResult = await this.repository.insert(entity);

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

    return { ...entity, ...updateSet };
  }

  async delete(id: Activity['id']): Promise<boolean> {
    const deleteResult = await this.repository.delete({ id });

    return !!deleteResult.affected;
  }

  async findBy(where?: Partial<Activity>): Promise<Activity[]> {
    const query = this.queryBuilder
      .where(where ?? {})
      .limit(10)
      .cache(5000);

    return await query.getMany();
  }

  async findById(id: Activity['id']): Promise<Activity> {
    const query = this.queryBuilder.where({ id });

    return await query.getOne();
  }
}
