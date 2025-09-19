import { Module } from '@nestjs/common';

/* Project */
import { MailerService, StorageService } from './services';
import { AppCacheModule } from './app-cache.module';
import { DatabaseModule } from './database.module';
import { AppThrottlerModule } from './throttler.module';

@Module({
  imports: [AppCacheModule, DatabaseModule, AppThrottlerModule],
  providers: [MailerService, StorageService],
  exports: [
    AppCacheModule,
    DatabaseModule,
    AppThrottlerModule,
    MailerService,
    StorageService,
  ],
})
export class SharedModule {}
