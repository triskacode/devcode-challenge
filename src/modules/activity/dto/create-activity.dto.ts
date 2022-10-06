import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty({ message: 'title cannot be null' })
  title: string;

  @IsEmail()
  email: string;
}
