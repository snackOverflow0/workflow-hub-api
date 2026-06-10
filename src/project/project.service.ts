import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async buildProject(workspaceId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        workspaceId: workspaceId
      }
    })
  }

  async getWorkspaceProjects(workspaceId: string) {
    return this.prisma.project.findMany({
      where: {
        workspaceId, isArchived: false
      },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })
  }
}
