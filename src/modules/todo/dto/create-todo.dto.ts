import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidActivityId } from 'src/modules/todo/validators/activity-id.validator';
import { Priority } from '../todo.types';

export class CreateTodoDto {
  @IsValidActivityId()
  @IsNotEmpty({ message: 'activity_group_id cannot be null' })
  activity_group_id: number;

  @IsString()
  @IsNotEmpty({ message: 'title cannot be null' })
  title: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
