import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { StorageModule } from 'src/storage/storage.module';
import { CacheModule } from 'src/cache/cache.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [StorageModule, CacheModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
