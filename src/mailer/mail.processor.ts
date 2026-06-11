import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'c35b2dac928e8b',
        pass: '72b4987f489f5e',
      },
    });
  }

  async process(job: Job<{ email: string; taskTitle: string }>): Promise<any> {
    const { email, taskTitle } = job.data;
    
    console.log(`[BULLMQ WORKER] Processing Job #${job.id}. Attempting SMTP dispatch to: ${email}...`);

    try {
      await this.transporter.sendMail({
        from: '"WorkFlow Hub Team" <noreply@workflowhub.com>',
        to: email,
        subject: 'New Queue-Backed Assignment Notification',
        text: `Hello! You have been assigned to a new task deliverable on WorkFlow Hub: "${taskTitle}". Let's crush this work item!`,
      });
      
      console.log(`[BULLMQ WORKER] Job #${job.id} completely finished. Email successfully dispatched.`);
    } catch (error) {
      console.error(`[BULLMQ WORKER] Job #${job.id} failed credentials handshake or network timeout.`);
      throw error;
    }
  }
}