import { Logger, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';

/* Project */
import { COUNTRY_REPOSITORY } from '@infrastructure/database/repositories';
import { CountryEntity } from './models';
import { SequelizeCountryRepository } from './repos';
import { getProjectFile } from '@shared/utils';

const sequelizeLogger = new Logger('Sequelize');

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const [key, cert, ca] = await Promise.all([
          getProjectFile('client-key.pem'),
          getProjectFile('client-cert.pem'),
          getProjectFile('server-ca.pem'),
        ]);

        return {
          dialect: configService.get('DB_CONNECTION'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadModels: true,
          synchronize: /true/.test(configService.get('DB_SYNC')!),
          logging: (e) =>
            /true/.test(configService.get<string>('DB_LOGGER')!) &&
            sequelizeLogger.log(e.replace(/\s+/g, ' ')),
          benchmark: true,
          pool: {
            max: configService.get('DB_MAX_CONNECTIONS') || 10, // max db connections for service
            min: configService.get('DB_MIN_CONNECTIONS') || 1, // min db connections for service
            acquire: 30 * 1000, // reduce to 30s
            idle: 15 * 1000, // increase to 15 seconds
          },
          dialectOptions: /true/.test(configService.get<string>('DB_SSL')!)
            ? {
                ssl: {
                  key,
                  cert,
                  ca,
                  rejectUnauthorized: false,
                },
              }
            : {},
        };
      },
    }),
    SequelizeModule.forFeature([CountryEntity]),
  ],
  providers: [
    {
      provide: COUNTRY_REPOSITORY,
      useClass: SequelizeCountryRepository,
    },
  ],
  exports: [COUNTRY_REPOSITORY],
})
export class SequelizeDbModule {}
