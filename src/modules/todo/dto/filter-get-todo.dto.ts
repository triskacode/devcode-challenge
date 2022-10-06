import { IsNumberString, IsOptional } from 'class-validator';

export class FilterGetTodoDto {
  @IsOptional()
  @IsNumberString()
  activity_group_id?: number;
}
