import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('project/:projectId/tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createProject(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto
  ) {
    return this.taskService.createProjectTask(projectId, dto);
  }

  @Get()
  async getProjects(@Param('projectId') projectId: string) {
    return this.taskService.getProjectTasks(projectId);
  }
}
