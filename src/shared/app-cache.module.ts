import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

/* Project */
import { KeyvRedisFactory } from './factories';
import { RedisService } from './services';

@Module({
  imports: [
    ConfigModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: KeyvRedisFactory,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class AppCacheModule {}
