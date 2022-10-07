import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Priority } from '../todo.types';

export class CreateTodoDto {
  @IsNumber()
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
