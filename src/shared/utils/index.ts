/* Project */
import { Role } from '../enums';

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

export const UUID_SQL = `SELECT uuid_in(overlay(overlay(md5(random()::text || ':' || random()::text) placing '4' from 13) placing to_hex(floor(random()*(11-8+1) + 8)::int)::text from 17)::cstring) as uuid;`;

export const DEFAULT_TIMEZONE = 'America/Lima' as const;

export const MB_BYTES = 1_000_000;
export const MAX_DEFAULT_MB = 10;

/**
 * Max bytes allowed to upload objects
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

export const createSortObject = (
  sort: string,
  separator: string = ' ',
): Record<string, string> => {
  const sortObject = {};
  const sortFilters = sort.split(',');

  sortFilters.map((filterAndCriteria) => {
    const filter = filterAndCriteria.split(separator);
    sortObject[filter[0]] = filter[1];
    return filter;
  });

  return sortObject;
};

export const minutesInMilliseconds = (minutes: number) => minutes * 60 * 1000;
export const secondsInMilliseconds = (seconds: number) => seconds * 1000;

const fileNameRegex = /^[\w,\s-]+\.[A-Za-z0-9]{1,5}$/;

export const isFileName = (fileName: string) => fileNameRegex.test(fileName);
