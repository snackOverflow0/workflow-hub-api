import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async createWorkspace(userId: string, dto: CreateWorkspaceDto) {
    return this.prisma.$transaction(async (tx) => {
      const workspace = await this.prisma.workspace.create({
        data: {
          name: dto.name,
          ownerId: userId
        }
      })

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: userId,
          role: 'OWNER'
        }
      })

      return workspace
    })
  }

  async addMemberToWorkspace(workspaceId: string, dto: AddMemberDto) {
    const targetUser = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!targetUser) {
      throw new NotFoundException('No user account discovered matching that email address.')
    }

    const existingMembership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: targetUser.id
        }
      }
    })

    if (existingMembership) {
      throw new BadRequestException('This collaborator is already a member of this workspace.')
    }

    return this.prisma.workspaceMember.create({
      data: {
        workspaceId,
        userId: targetUser.id,
        role: dto.role
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })

  }

  async getUserWorkspaces(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: { some: { userId } }
      },
      include: {
        _count: {
          select: {
            members: true,
            projects: true
          }
        }
      }
    })
  }

}
