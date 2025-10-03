import { SetMetadata } from '@nestjs/common';

/* Project */
import { IS_PUBLIC_KEY } from '@shared/helpers';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
