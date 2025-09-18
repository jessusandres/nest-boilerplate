import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/* Project */
import { Role } from '../enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { USER_TYPES_MAP } from '../utils';
import { IUserProfile } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) return true;

    const request = context.switchToHttp().getRequest();

    const user: IUserProfile = request.user;

    if (!user?.id) throw new UnauthorizedException('User not found');

    const userRole = USER_TYPES_MAP[user.roleId];

    if (!userRole)
      throw new UnauthorizedException(
        "User doesn't have permission to access these resources",
      );

    const matchRole = requiredRoles.some((role) => userRole === role);

    if (!matchRole)
      throw new UnauthorizedException(
        "User doesn't have permission to access these resources",
      );

    return true;
  }
}
