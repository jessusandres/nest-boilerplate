import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

/* Project */
import { secondsInMilliseconds } from '@shared/utils';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: secondsInMilliseconds(config.get<number>('THROTTLE_TTL')!),
          limit: config.get<number>('THROTTLE_LIMIT')!,
        },
      ],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [ThrottlerModule],
})
export class AppThrottlerModule {}
