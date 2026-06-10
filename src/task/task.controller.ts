import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('project/:projectId/tasks')
  async createProject(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto
  ) {
    return this.taskService.createProjectTask(projectId, dto);
  }

  @Get('project/:projectId/tasks')
  async getProjects(@Param('projectId') projectId: string) {
    return this.taskService.getProjectTasks(projectId);
  }

  @Post('tasks/:id/attachments')
  @UseInterceptors(FileInterceptor('file')) // Intercept standard form payload binary files labeled 'file'
  async uploadTaskFile(
    @Param('id') taskId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Please provide a valid multi-part form binary file asset payload.');
    }
    
    return this.taskService.addAttachmentToTask(taskId, file);
  }
}
