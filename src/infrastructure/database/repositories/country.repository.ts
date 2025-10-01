import { ICountry } from '@infrastructure/database/interfaces';

export interface CountryRepository {
  findLast(): Promise<ICountry | undefined>;
}

export const COUNTRY_REPOSITORY = Symbol('COUNTRY_REPOSITORY');
