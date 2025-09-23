import { Module } from '@nestjs/common';

/* Project */
import { StorageModule } from '@infrastructure/storage';
import { MailerService, StorageService } from './services';

@Module({
  imports: [StorageModule],
  providers: [MailerService, StorageService],
  exports: [MailerService, StorageService],
})
export class SharedModule {}
