import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';

/* Extra */
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

/* Project */
import { filterRequestParams } from '../helpers';

@Catch(TypeError)
export class TypeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(TypeExceptionFilter.name);

  /**
   * Catch any exception in types
   * @param {TypeError} exception
   * @param {ArgumentsHost} host
   */
  catch(exception: TypeError, host: ArgumentsHost) {
    this.logger.warn('=== TypeExceptionFilter ===');
    if (exception instanceof Error) this.logger.error(exception.stack);
    this.logger.error(exception);

    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

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
        message: `Oops, Tuvimos un error en el sistema, si el problema persiste comunícate con el administrador de sistema, código de error: x${uuid}.
        We had an error in the system, if the problem persists contact the system administrator, error code: x${uuid}`,
      },
    });
  }
}
