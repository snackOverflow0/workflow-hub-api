import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty({ message: 'The workspace name cannot be empty.' })
  @MaxLength(50, { message: 'Workspace names must be under 50 characters.' })
  name!: string;
}