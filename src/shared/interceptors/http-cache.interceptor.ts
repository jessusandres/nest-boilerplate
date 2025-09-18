import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

/* External */
import { Request } from 'express';

/* Project */
import { AuthenticatedRequest } from '../interfaces';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  private readonly logger = new Logger(HttpCacheInterceptor.name);

  trackBy(context: ExecutionContext): string | undefined {
    const httpContext = context.switchToHttp();
    const request: AuthenticatedRequest = httpContext.getRequest();

    const userId = request.user?.id || 'anonymous';

    const key = `${userId}:${request.method}:${request.originalUrl}`;

    this.logger.debug(
      `Using key ${key} to get cache from original URL: ${request.originalUrl}`,
    );

    return key;
  }
}
