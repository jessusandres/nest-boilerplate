import { Module } from '@nestjs/common';

/* Project */
import { MailerService, StorageService } from './services';
import { AppCacheModule } from './app-cache.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [AppCacheModule, DatabaseModule],
  providers: [MailerService, StorageService],
  exports: [AppCacheModule, DatabaseModule, MailerService, StorageService],
})
export class SharedModule {}
