import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

/* Project */
import { getEnv } from './shared/utils';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvValidation } from './shared/validators';
import { LoggerMiddleware } from './shared/middlewares';
import { SharedModule } from './shared/shared.module';
import { Modules } from './components';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: EnvValidation,
      isGlobal: true,
      expandVariables: true,
      envFilePath: getEnv(),
    }),
    HttpModule,
    CqrsModule.forRoot(),
    SharedModule,
    ...Modules,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*path',
      method: RequestMethod.ALL,
    });
  }
}
