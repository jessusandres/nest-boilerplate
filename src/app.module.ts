import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';

/* Project */
import { LoggerMiddleware } from './middlewares';
import { Modules } from './modules';
import { Models } from './models';
import { getEnv } from './helpers';
import { BigqueryService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: getEnv(),
    }),
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
        logging: /true/.test(configService.get('DB_LOGGER')) && console.log,
        dialectOptions: /true/.test(configService.get('DB_SSL'))
          ? {
              ssl: {
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
              },
            }
          : {},
      }),
      inject: [ConfigService],
    }),
    ...Modules,
  ],
  providers: [BigqueryService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
