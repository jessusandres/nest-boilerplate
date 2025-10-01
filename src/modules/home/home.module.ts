import { Module } from '@nestjs/common';

/* Project */
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { SharedModule } from '@shared/shared.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { QueryHandlers } from './queries';

@Module({
  imports: [InfrastructureModule, SharedModule],
  controllers: [HomeController],
  providers: [...QueryHandlers, HomeService],
})
export class HomeModule {}
