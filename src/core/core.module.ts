import { Module } from '@nestjs/common';

/* Project */
import { HealthModule } from '@core/health/health.module';

@Module({
  imports: [HealthModule],
  providers: [],
  exports: [HealthModule],
})
export class CoreModule {}
