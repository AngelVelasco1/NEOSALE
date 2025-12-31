import { MailerSend } from 'mailersend';

let mailerSendInstance: MailerSend | null = null;

export function getMailerSend(): MailerSend {
  if (!mailerSendInstance) {
    if (!process.env.MAILERSEND_API_KEY) {
      throw new Error('MAILERSEND_API_KEY is not defined in environment variables');
    }

    mailerSendInstance = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY,
    });
  }

  return mailerSendInstance;
}
