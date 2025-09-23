import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

/* Project */
import { CountryEntity } from '@infrastructure/database/models';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { SharedModule } from '@shared/shared.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { QueryHandlers } from './queries';

@Module({
  imports: [
    InfrastructureModule,
    SharedModule,
    SequelizeModule.forFeature([CountryEntity]),
  ],
  controllers: [HomeController],
  providers: [...QueryHandlers, HomeService],
})
export class HomeModule {}
