import { SetMetadata } from '@nestjs/common';

/* Project */
import { Role } from '../enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
