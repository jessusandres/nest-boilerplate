import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class MailerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MailerService.name);
  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    this.logger.log('Initializing mail provider...');
  }

  async send(emailPayload: {
    from: string;
    to: string;
  }): Promise<{ status: number }> {
    this.logger.log('Sending email...');

    this.logger.log(JSON.stringify(emailPayload));

    return Promise.resolve({ status: 200 });
  }
}
