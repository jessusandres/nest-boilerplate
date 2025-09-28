if (/true/.test(process.env.ENABLE_NEW_RELIC || 'false')) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('newrelic');
}

import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';

import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';

/* Project */
import { setupSwagger } from '@core/swagger';
import {
  HttpExceptionFilter,
  SequelizeExceptionFilter,
  TypeExceptionFilter,
} from '@shared/filters';
import { validationPipeOptions } from '@shared/helpers';
import { AuthGuard } from '@shared/guards';
import { RolesGuard } from '@shared/guards/roles.guard';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const logger = new Logger('APP');
  const configService: ConfigService = app.get(ConfigService);

  const pathPrefix: string = configService.get('PATH_PREFIX') || 'api';

  const port = configService.get<number>('PORT')!;

  app.setGlobalPrefix(pathPrefix, {
    exclude: ['health'],
  });

  app.enableCors();

  app.useBodyParser('json', { limit: '10mb' });
  app.useBodyParser('urlencoded', { limit: '10mb', extended: true });

  // Global error filters
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new SequelizeExceptionFilter());
  app.useGlobalFilters(new TypeExceptionFilter());

  // Global pipe validator for DTO's and commands
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  // Global guard for all routes
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));
  app.useGlobalGuards(new RolesGuard(reflector));

  const swaggerConfig = setupSwagger(configService);
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    // ignoreGlobalPrefix: true,
  });
  SwaggerModule.setup('docs', app, document);

  logger.log(`PORT::${configService.get('PORT')}`);

  // Enable NestJs hooks for shutdown operations
  app.enableShutdownHooks();

  await app.init();

  await app.listen(port, () => {
    logger.log(`APP READY TO LISTEN ON PORT::${configService.get('PORT')}`);
  });
}

void bootstrap();
