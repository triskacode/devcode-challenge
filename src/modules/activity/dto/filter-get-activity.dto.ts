import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FilterGetActivityDto {
  @IsOptional()
  @Type(() => String)
  email?: string;
}
