import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { BullModule } from '@nestjs/bullmq';
import { MailProcessor } from './mail.processor';
@Module({
  imports: [ 
    BullModule.registerQueue({
      name: 'mail-queue'
    })
  ],
  providers: [MailerService, MailProcessor]
})
export class MailerModule {}
