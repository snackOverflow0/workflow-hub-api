import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService
  ) {}

  async buildProject(workspaceId: string, dto: CreateProjectDto) {
    const newProject = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        workspaceId: workspaceId
      }
    })

    const cacheKey = `workspace:${workspaceId}:projects`
    await this.cache.del(cacheKey)

    return newProject
  }

  async getWorkspaceProjects(workspaceId: string) {
    const cacheKey = `workspace:${workspaceId}:projects`

    const cachedData = await this.cache.get(cacheKey)
    if (cachedData) {
      console.log(`[CACHE HIT]: Returning projects list for Workspace ${workspaceId} from Redis memory.`)
      return JSON.parse(cachedData)
    }

    console.log(`[CACHE MISS]: Querying PostgreSQL engine for Workspace ${workspaceId} projects list.`)

    const dbProjects = await this.prisma.project.findMany({
      where: { workspaceId, isArchived: false },
      include: { _count: { select: { tasks: true } } },
    })

    await this.cache.set(cacheKey, JSON.stringify(dbProjects), 300)

    return dbProjects
  }
}
