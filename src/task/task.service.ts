import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from 'src/cache/cache.service';
import { StorageService } from 'src/storage/storage.service';
@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private storage: StorageService
  ) {}

  async createProjectTask(projectId: string, dto: CreateTaskDto) {
    const newTask = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        projectId: projectId,
        assignedToId: dto.assignedToId
      },
      include: {
        assignee: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })

    const cacheKey = `project:${projectId}:tasks`
    await this.cache.del(cacheKey)

    return newTask
  }

  async getProjectTasks(projectId: string) {
    const cacheKey = `project:${projectId}:tasks`

    const cachedData = await this.cache.get(cacheKey)
    if (cachedData) {
      console.log(`[CACHE HIT]: Returning tasks list for Project ${projectId} from Redis memory.`)
      return JSON.parse(cachedData)
    }

    console.log(`[CACHE MISS]: Querying PostgreSQL engine for Project ${projectId} projects list.`)

    const dbTasks = await this.prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    })

    await this.cache.set(cacheKey, JSON.stringify(dbTasks), 300)

    return dbTasks
  }

  async addAttachmentToTask(taskId: string, file: Express.Multer.File) {
    const taskExists = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!taskExists) {
      throw new NotFoundException('Target task entity not found.');
    }

    const cloudAsset = await this.storage.uploadFileToCloud(file);

    return this.prisma.attachment.create({
      data: {
        taskId: taskId,
        fileUrl: cloudAsset.secure_url, 
        fileName: file.originalname,
      },
    });
  }
}
