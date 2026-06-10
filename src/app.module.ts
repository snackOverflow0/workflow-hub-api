import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { CacheModule } from './cache/cache.module';
import { StorageModule } from './storage/storage.module';
import { MailerModule } from './mailer/mailer.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule, 
    AuthModule, 
    WorkspaceModule, 
    ProjectModule, 
    TaskModule, 
    CacheModule, 
    StorageModule, 
    MailerModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})
export class AppModule {}
