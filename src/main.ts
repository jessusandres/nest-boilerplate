import { ExpressAdapter } from '@nestjs/platform-express';
import { http } from '@google-cloud/functions-framework';
import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import * as express from 'express';

/* Extra */
import { Express } from 'express';
import * as bodyParser from 'body-parser';

/* Project */
import { AppModule } from './app.module';
import {
  HttpExceptionFilter,
  SequelizeExceptionFilter,
  TypeExceptionFilter,
} from './filters';
import { validationPipeOptions } from './helpers';
import * as process from 'process';

const server = express();
let nestApplication: INestApplication;

const logger = new Logger('APP');

export const bootstrapServer = async (expressInstance: Express) => {
  nestApplication = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  nestApplication.use(bodyParser.json({ limit: '50mb' }));

  nestApplication.useGlobalFilters(new HttpExceptionFilter());
  nestApplication.useGlobalFilters(new SequelizeExceptionFilter());
  nestApplication.useGlobalFilters(new TypeExceptionFilter());

  // Global pipe validator for DTO's and commands
  nestApplication.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  return nestApplication.init();
};

try {
  if (/true/.test(process.env.RUN_AFTER_DEPLOY)) {
    bootstrapServer(server).then(() => {
      logger.debug('RUN_AFTER_DEPLOY: initialization');
    });
  }

  http('api', async (request, response) => {
    if (!nestApplication) {
      logger.debug('Server not initialized executing bootstrap method');
      await bootstrapServer(server);
    }

    server(request, response);
  });
} catch (err) {
  logger.error(err);
}
