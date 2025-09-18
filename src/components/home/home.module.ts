import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

/* Project */
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { CountryEntity } from '../../shared/models';
import { SharedModule } from '../../shared/shared.module';
import { QueryHandlers } from './queries';

@Module({
  imports: [SharedModule, SequelizeModule.forFeature([CountryEntity])],
  controllers: [HomeController],
  providers: [...QueryHandlers, HomeService],
})
export class HomeModule {}
