import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';

/* External */
import { ValidationError } from 'class-validator';
import { Request } from 'express';

/* Project */
import { Role } from '../enums';

type Dict = Record<string, unknown>;

const blockedKeys = ['pass', 'password', 'card'];

export const filterRequestParams = (req: Request) => {
  const params: Dict = (req.params ?? {}) as Dict;
  const body: Dict = (req.body ?? {}) as Dict;
  const query: Dict = (req.query ?? {}) as Dict;

  return Object.entries({ ...params, ...body, ...query })
    .map(([key, value]) =>
      blockedKeys.includes(key) ? { key, value: '******' } : { key, value },
    )
    .reduce((accumulator, current) => {
      return { ...accumulator, [current.key]: current.value };
    }, {});
};

export const JWKS_REQUESTS_PER_MINUTE = 5 as const;
export const RS256_ALGORITHM = 'RS256' as const;
export const REQUEST_PROPERTY = 'jwt' as const;

export const DEFAULT_PAGE = 1 as const;
export const DEFAULT_SIZE = 10 as const;
export const DEFAULT_SIZE_XLSX = 2000 as const;

export const USER_ROLES_MAP: Record<number, Role> = {
  1: Role.ADMIN,
  3: Role.CLIENT,
} as const;

const constraintsAccumulator = (errors: ValidationError[]) => {
  return errors
    .map((err: ValidationError) => Object.values(err.constraints ?? {}))
    .reduce((accumulator, next) => [...accumulator, ...next], []);
};
export default constraintsAccumulator;

/**
 * Default validation options for global pipe and tests
 */
export const validationPipeOptions: ValidationPipeOptions = {
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  exceptionFactory: (errors) => {
    const constraints = constraintsAccumulator(errors);

    throw new BadRequestException(
      `Some data isn't valid: ${constraints.toString()}`,
      {
        cause: errors,
      },
    );
  },
};

export const UUID_SQL = `SELECT uuid_in(overlay(overlay(md5(random()::text || ':' || random()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring) as uuid;`;

export const DEFAULT_TIMEZONE = 'America/Lima' as const;

export const MB_BYTES = 1_000_000;
export const MAX_DEFAULT_MB = 10;

/**
 * Max bytes allowed uploading objects
 */
export const MAX_FILE_SIZE = MAX_DEFAULT_MB * MB_BYTES;

export const IS_PUBLIC_KEY = 'isPublic';

export const getSQLPagination = (
  page: number = DEFAULT_PAGE,
  size: number = DEFAULT_SIZE,
) => ({
  limit: size,
  offset: size * page,
});
