import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  NotImplementedException,
  PipeTransform,
} from '@nestjs/common';
import { ActivityRepository } from '../activity.repository';

@Injectable()
export class MustValidActivityIdPipe implements PipeTransform {
  constructor(private activityRepository: ActivityRepository) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    console.log(value, metadata);
    if (metadata.type !== 'param') {
      throw new NotImplementedException(
        'MustValidActivityIdPipe must be used with Param decorator',
      );
    }

    const activity = await this.activityRepository.findById(+value);

    if (!activity)
      throw new NotFoundException(`Activity with id ${value} not found`);

    return activity;
  }
}
