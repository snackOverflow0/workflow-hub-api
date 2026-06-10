import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 2525,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  @OnEvent('task.assigned')
  async handleTaskAssignedEvent(payload: { email: string; taskTitle: string }) {
    console.log(`📨 [EVENT EXECUTOR]: Intercepted assignment event. Dispatching background email alert to ${payload.email}...`);
    
    await this.transporter.sendMail({
      from: '"WorkFlow Hub Team" <noreply@workflowhub.com>',
      to: payload.email,
      subject: 'New Assignment Notification',
      text: `Hello! You have been assigned to a new task deliverable on WorkFlow Hub: "${payload.taskTitle}". Let's crush this work item!`,
    });

    console.log('[MAIL STREAM COMPLETE]: Background system email alert delivered successfully.');
  }
}