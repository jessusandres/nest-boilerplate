import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { ThrottlerGuard } from '@nestjs/throttler';

/* Project */
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { AppConfigModule } from '@core/config';
import { CoreModule } from '@core/core.module';
import { LoggerMiddleware } from '@shared/middlewares';
import { SharedModule } from '@shared/shared.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Modules } from './modules';

@Module({
  imports: [
    HttpModule,
    CqrsModule.forRoot(),
    AppConfigModule,
    CoreModule,
    SharedModule,
    InfrastructureModule,
    ...Modules,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
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
