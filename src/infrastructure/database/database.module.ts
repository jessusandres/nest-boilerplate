import { Module } from '@nestjs/common';

/* Project */
import { SequelizeDbModule } from './impl/sequelize';
import { TypeOrmDbModule } from './impl/typeorm';

@Module({
  // Only for demo purposes, you can use only one database, the sort of imports matters
  imports: [TypeOrmDbModule, SequelizeDbModule],
  providers: [],
  exports: [SequelizeDbModule, TypeOrmDbModule],
})
export class DatabaseModule {}
