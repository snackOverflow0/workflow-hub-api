import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailerService {
  constructor(@InjectQueue('mail-queue') private mailQueue: Queue) {}

  @OnEvent('task.assigned')
  async handleTaskAssignedEvent(payload: { email: string; taskTitle: string }) {
    console.log('[EVENT INTERCEPTOR] Intercepted event. Staging job to persistent Redis queue layer...');

    // Add job payload to the Redis-backed BullMQ stream
    const job = await this.mailQueue.add(
      'send-assignment-email', 
      payload, 
      {
        attempts: 3, // AUTO-RETRY: If your mail server drops, retry up to 3 times automatically
        backoff: {
          type: 'exponential', // Exponential Backoff: Wait longer between each retry attempt (e.g., 2s, 4s, 8s)
          delay: 2000,
        },
        removeOnComplete: true,
      }
    );

    console.log(`[QUEUE ENGINES] Job #${job.id} safely stored in Redis. Main thread execution free to return!`);
  }
}