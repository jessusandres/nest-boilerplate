import { randomUUID } from 'crypto';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

/* External */
import { Request, Response } from 'express';

/* Project */
import { filterRequestParams } from '../helpers';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Catch any exception type HTTP triggered by nest
   * @param {HttpException} exception
   * @param {ArgumentsHost} host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.warn('=== HttpExceptionFilter ===');

    this.logger.error(exception.stack);
    this.logger.error(exception);

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();

    const timestamp = new Date().toISOString();

    const uuid = randomUUID();

    const params = filterRequestParams(request);

    this.logger.error({
      code: status,
      clientCode: uuid,
      message: exception.message,
      cause: exception.cause,
      path: request.path,
      params,
      timestamp,
    });

    response.status(status).json({
      timestamp,
      error: {
        code: status,
        clientCode: uuid,
        message: `${exception.message}, error code: x${uuid}`,
      },
    });
  }
}
