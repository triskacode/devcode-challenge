import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityRepository } from './activity.repository';
import { MustValidActivityIdPipe } from './pipe/must-valid-activity-id.pipe';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository, MustValidActivityIdPipe],
  exports: [ActivityService, ActivityRepository],
})
export class ActivityModule {}
