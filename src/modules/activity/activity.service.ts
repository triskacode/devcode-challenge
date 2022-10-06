import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ActivityRepository } from './activity.repository';
import { CreateActivityDto } from './dto/create-activity.dto';
import { FilterGetActivityDto } from './dto/filter-get-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivityService {
  constructor(private readonly activitiesRepository: ActivityRepository) {}

  async create(createActivityDto: CreateActivityDto) {
    try {
      const activity = new Activity();
      activity.title = createActivityDto.title;
      activity.email = createActivityDto.email;

      return await this.activitiesRepository.create(activity);
    } catch (err) {
      Logger.error(err.message, 'ActivityService - create');

      throw err;
    }
  }

  async findBy(filter: FilterGetActivityDto) {
    try {
      return await this.activitiesRepository.findBy(filter);
    } catch (err) {
      Logger.error(err.message, 'ActivityService - findBy');

      throw err;
    }
  }

  async findById(id: number) {
    try {
      const activity = await this.activitiesRepository.findById(id);

      if (!activity)
        throw new NotFoundException(`Activity with ID ${id} Not Found`);

      return activity;
    } catch (err) {
      Logger.error(err.message, 'ActivityService - findById');

      throw err;
    }
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    try {
      const activity = await this.activitiesRepository.findById(id);

      if (!activity)
        throw new NotFoundException(`Activity with ID ${id} Not Found`);

      return await this.activitiesRepository.update(
        activity,
        updateActivityDto,
      );
    } catch (err) {
      Logger.error(err.message, 'ActivityService - update');

      throw err;
    }
  }

  async remove(id: number) {
    try {
      const activity = await this.activitiesRepository.findById(id);

      if (!activity)
        throw new NotFoundException(`Activity with ID ${id} Not Found`);

      await this.activitiesRepository.delete(activity);

      return {};
    } catch (err) {
      Logger.error(err.message, 'ActivityService - remove');

      throw err;
    }
  }
}
