import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatus, TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Task title is required.' })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus, { message: 'Invalid task status column allocation.' })
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Invalid priority matrix rank assignment.' })
  @IsOptional()
  priority?: TaskPriority;

  @IsUUID('4', { message: 'Assigned user identifier must be a valid UUIDv4.' })
  @IsOptional()
  assignedToId?: string;
}