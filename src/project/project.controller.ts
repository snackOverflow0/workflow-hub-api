import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('workspace/:workspaceId/projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: CreateProjectDto
  ) {
    return this.projectService.buildProject(workspaceId, dto);
  }

  @Get()
  async getProjects(@Param('workspaceId') workspaceId: string) {
    return this.projectService.getWorkspaceProjects(workspaceId);
  }
}
