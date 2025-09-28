import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/* External */
import { IS_PUBLIC_KEY } from '../utils';
import { AuthenticatedRequest } from '@shared/interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    this.logger.debug('Executing auth guard');
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('No token provided');
    }

    const { userId, userType } = request.query;

    if (!userId || !userType) {
      throw new UnauthorizedException('No user id or user type provided');
    }

    this.logger.warn('Remember search, validate and set user');

    // TODO: Replace the follow code with a real validation
    const role: string = typeof userType === 'string' ? userType : '';
    const id: number = typeof userId === 'string' ? +userId : 0;
    const roleId: number = role === 'admin' ? 1 : 2;

    request.user = {
      email: '',
      id,
      name: '',
      role,
      roleId,
    };

    return true;
  }
}
