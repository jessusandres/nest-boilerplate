import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

/* Extra */
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    const startTime = new Date().getTime();
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('close', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      const finallyTime = new Date().getTime();

      const dateDif = finallyTime - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${dateDif}ms ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
