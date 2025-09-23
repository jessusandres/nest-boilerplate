import { Module } from '@nestjs/common';

/* Project */
import { AppCacheModule } from './cache';
import { AppThrottlerModule } from './limiter';
import { DatabaseModule } from './database';

@Module({
  imports: [AppCacheModule, AppThrottlerModule, DatabaseModule],
  providers: [],
  exports: [AppCacheModule, AppThrottlerModule, DatabaseModule],
})
export class InfrastructureModule {}
