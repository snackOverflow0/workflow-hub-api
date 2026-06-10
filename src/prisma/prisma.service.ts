import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        await this.$connect()
        console.log('[WORKFLOW HUB DATA TIER]: Global PostgreSQL data engine connection established cleanly')
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
  }
