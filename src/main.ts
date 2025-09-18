if (/true/.test(process.env.ENABLE_NEW_RELIC || 'false')) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('newrelic');
}

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/* External */
import * as bodyParser from 'body-parser';

/* Project */
import {
  HttpExceptionFilter,
  SequelizeExceptionFilter,
  TypeExceptionFilter,
} from './shared/filters';
import { AppModule } from './app.module';
import { AuthGuard } from './shared/guards';
import { validationPipeOptions } from './shared/helpers';
import { RolesGuard } from './shared/guards/roles.guard';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, {});

  const logger = new Logger('APP');
  const configService: ConfigService = app.get(ConfigService);

  const pathPrefix: string = configService.get('PATH_PREFIX') || 'api';

  const swaggerOptions = {
    title: configService.get('APP_NAME') || 'Example API',
    description: configService.get('APP_DESCRIPTION') || 'Example API',
    version: configService.get('API_VERSION') || '1.0',
  };

  const port = configService.get('PORT') || 3000;

  app.setGlobalPrefix(pathPrefix, {
    exclude: ['health'],
  });

  app.enableCors();

  app.use(bodyParser.json({ limit: '10mb' }));

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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle(swaggerOptions.title)
    .setDescription(swaggerOptions.description)
    .setVersion(swaggerOptions.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
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

bootstrap();
