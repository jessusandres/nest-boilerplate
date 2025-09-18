import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

/* Project */
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: true,
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
