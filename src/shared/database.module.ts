import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Models } from './models';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get('DB_CONNECTION'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        models: Models,
        autoLoadModels: true,
        synchronize: /true/.test(configService.get('DB_SYNC')!),
        logging: /true/.test(configService.get('DB_LOGGER')!) && console.log,
        benchmark: true,
        pool: {
          max: configService.get('DB_MAX_CONNECTIONS') || 10, // max db connections for service
          min: configService.get('DB_MIN_CONNECTIONS') || 1, // min db connections for service
          acquire: 30 * 1000, // reduce to 30s
          idle: 15 * 1000, // increase to 15 seconds
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
