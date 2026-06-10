import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { WorkspaceRole } from '@prisma/client';

export class AddMemberDto {
  @IsEmail({}, { message: 'Please provide a valid email address for the target collaborator.' })
  @IsNotEmpty()
  email!: string;

  @IsEnum(WorkspaceRole, { message: 'Role must be either ADMIN or MEMBER.' })
  @IsNotEmpty()
  role!: WorkspaceRole;
}