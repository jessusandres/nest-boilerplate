import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

/* Project */
import { RedisService } from './redis.service';
import { KeyvRedisFactory } from './redis.factory';

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
