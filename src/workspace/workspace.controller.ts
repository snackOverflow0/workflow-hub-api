import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('workspace')
@UseGuards(AuthGuard('jwt'))
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  createWorkspace(
    @Request() req,
    @Body() dto: CreateWorkspaceDto
  ) {
    return this.workspaceService.createWorkspace(req.user.id, dto);
  }

  @Post(':id/members')
  addMemberToWorkspace(
    @Param('id') workspaceId: string,
    @Body() dto: AddMemberDto
  ) {
    return this.workspaceService.addMemberToWorkspace(workspaceId, dto);
  }

  @Get()
  getUserWorkspaces(@Request() req) {
    const userId = req.user.id
    return this.workspaceService.getUserWorkspaces(userId);
  }


}
