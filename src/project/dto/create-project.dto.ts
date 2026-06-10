import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project board name cannot be left blank.' })
  @MaxLength(50, { message: 'Project titles must be under 50 characters.' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}