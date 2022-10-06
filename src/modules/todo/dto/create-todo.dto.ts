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
  @IsNotEmpty()
  @IsValidActivityId()
  activity_group_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
