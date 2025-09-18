/* External */
import { type Request } from 'express';

/* Project */
import { IUserProfile } from './user-profile.interface';

export interface AuthenticatedRequest extends Request {
  user: IUserProfile;
}
