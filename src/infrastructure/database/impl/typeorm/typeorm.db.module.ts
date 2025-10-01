import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/* Internal */
import fs from 'fs';
import path from 'path';

/* Project */
import { COUNTRY_REPOSITORY } from '@infrastructure/database/repositories';
import { TypeORMCountryRepository } from './repos';
import { CountryEntity } from './models';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get('DB_CONNECTION') as 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE')!,
        autoLoadEntities: true,
        synchronize: /true/.test(configService.get('DB_SYNC')!),
        logging: /true/.test(configService.get<string>('DB_LOGGER')!),
        pool: {
          max: configService.get<number>('DB_MAX_CONNECTIONS') || 10, // max db connections for service
          min: configService.get<number>('DB_MIN_CONNECTIONS') || 1, // min db connections for service
          acquireTimeoutMillis: 30 * 1000, // reduce to 30s
          idleTimeoutMillis: 15 * 1000, // increase to 15 seconds
        },
        ssl: /true/.test(configService.get<string>('DB_SSL')!)
          ? {
              key: fs
                .readFileSync(path.join(process.cwd(), 'client-key.pem'))
                .toString(),
              cert: fs
                .readFileSync(path.join(process.cwd(), 'client-cert.pem'))
                .toString(),
              ca: fs
                .readFileSync(path.join(process.cwd(), 'server-ca.pem'))
                .toString(),
              rejectUnauthorized: false,
            }
          : false,
      }),
    }),
    TypeOrmModule.forFeature([CountryEntity]),
  ],
  providers: [
    {
      provide: COUNTRY_REPOSITORY,
      useClass: TypeORMCountryRepository,
    },
  ],
  exports: [COUNTRY_REPOSITORY],
})
class TypeOrmDbModule {}

export default TypeOrmDbModule;
