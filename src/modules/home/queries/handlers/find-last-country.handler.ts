import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

/* Project */
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from '@infrastructure/database/repositories/country.repository';
import { FindLastCountryQuery } from '../impl';
import { FindLastCountryQueryResult } from '../interfaces';

@QueryHandler(FindLastCountryQuery)
export class FindLastCountryHandler
  implements IQueryHandler<FindLastCountryQuery>
{
  private readonly logger = new Logger(FindLastCountryHandler.name);

  constructor(
    @Inject(COUNTRY_REPOSITORY)
    private readonly countries: CountryRepository,
  ) {}

  async execute(
    query: FindLastCountryQuery,
  ): Promise<FindLastCountryQueryResult | undefined> {
    this.logger.debug(
      `Executing FindLastCountryHandler with payload: ${JSON.stringify(query)}`,
    );

    this.logger.log('Sleeping for 1 second 😴...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const lastCountry = await this.countries.findLast();

    if (!lastCountry) return undefined;

    return {
      id: lastCountry.id,
      name: lastCountry.name,
    };
  }
}
