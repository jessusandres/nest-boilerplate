import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';

/* Extra */
import { Request, Response } from 'express';
import { BaseError } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

/* Project */
import { filterRequestParams } from '../helpers';

@Catch(BaseError)
export class SequelizeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(SequelizeExceptionFilter.name);

  /**
   * Catch any exception triggered by sequelize
   * @param {BaseError} exception
   * @param {ArgumentsHost} host
   */
  catch(exception: BaseError, host: ArgumentsHost) {
    this.logger.warn('=== SequelizeExceptionFilter ===');
    if (exception instanceof Error) this.logger.error(exception.stack);
    this.logger.error(exception);

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.PRECONDITION_FAILED;

    const timestamp = new Date().toISOString();

    const uuid = uuidv4();

    const params = filterRequestParams(request);

    this.logger.error({
      code: status,
      clientCode: uuid,
      message: exception.message,
      errors: exception['errors'] || [],
      path: request.path,
      params,
      timestamp,
    });

    response.status(status).json({
      timestamp,
      error: {
        code: status,
        clientCode: uuid,
        message: `Oops, Algo sucedió con la base de datos, si el error persiste comunícate con el administrador de sistema, código de error: x${uuid}.
        Something happened with the database, if the error persists contact the system administrator, error code: x${uuid}`,
      },
    });
  }
}
