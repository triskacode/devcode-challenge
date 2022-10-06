import { Injectable, Logger } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ActivityRepository } from 'src/modules/activity/activity.repository';

export function IsValidActivityId(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isValidActivityId',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ActivityIdValidator,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'isValidActivityId', async: true })
export class ActivityIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly activitiesRepository: ActivityRepository) {}

  public async validate(value: any) {
    try {
      const activity = await this.activitiesRepository.findById(value);

      return !!activity;
    } catch (err) {
      Logger.error(err.message, 'ActivityIdValidator - validate');

      return false;
    }
  }

  public defaultMessage(args: ValidationArguments) {
    return `${args.property} must reference id on activity`;
  }
}
