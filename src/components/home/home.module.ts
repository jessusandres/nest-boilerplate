import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

/* Project */
import { CountryEntity } from '@shared/models';
import { SharedModule } from '@shared/shared.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { QueryHandlers } from './queries';

@Module({
  imports: [SharedModule, SequelizeModule.forFeature([CountryEntity])],
  controllers: [HomeController],
  providers: [...QueryHandlers, HomeService],
})
export class HomeModule {}
