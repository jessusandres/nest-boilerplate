import { InjectModel } from '@nestjs/sequelize';
import { Logger } from '@nestjs/common';

/* Project */
import { ICountry } from '@infrastructure/database/interfaces';
import { CountryRepository } from '@infrastructure/database/repositories';
import { CountryEntity } from '../models/country.entity';

export class SequelizeCountryRepository implements CountryRepository {
  private readonly logger = new Logger(SequelizeCountryRepository.name);

  constructor(
    @InjectModel(CountryEntity)
    private readonly countryEntity: typeof CountryEntity,
  ) {}

  async findLast(): Promise<ICountry | undefined> {
    this.logger.debug('Finding last country from Sequelize');

    const lastCountry = await this.countryEntity.findOne({
      order: [['id', 'DESC']],
    });

    if (!lastCountry) return undefined;

    return {
      id: lastCountry.id,
      name: lastCountry.name,
    } as ICountry;
  }
}
