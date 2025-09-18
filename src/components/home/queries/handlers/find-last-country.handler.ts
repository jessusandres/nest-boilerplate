import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';

/* Project */
import { FindLastCountryQuery } from '../impl';
import { FindLastCountryQueryResult } from '../interfaces';
import { CountryEntity } from '../../../../shared/models';

@QueryHandler(FindLastCountryQuery)
export class FindLastCountryHandler
  implements IQueryHandler<FindLastCountryQuery>
{
  private readonly logger = new Logger(FindLastCountryHandler.name);

  constructor(
    @InjectModel(CountryEntity)
    private readonly countryEntity: typeof CountryEntity,
  ) {}

  async execute(
    query: FindLastCountryQuery,
  ): Promise<FindLastCountryQueryResult | undefined> {
    this.logger.debug(
      `Executing FindLastCountryHandler with payload: ${JSON.stringify(query)}`,
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lastCountry = await this.countryEntity.findOne({
      limit: 1,
      order: [['id', 'DESC']],
    });

    if (!lastCountry) return undefined;

    return {
      id: lastCountry.id,
      name: lastCountry.name,
    };
  }
}
