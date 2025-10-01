import { CountryRepository } from '@infrastructure/database/repositories';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

/* External */
import { Repository } from 'typeorm';

/* Project */
import { ICountry } from '@infrastructure/database/interfaces';
import { CountryEntity } from '../models';

export class TypeORMCountryRepository implements CountryRepository {
  private readonly logger = new Logger(TypeORMCountryRepository.name);

  constructor(
    @InjectRepository(CountryEntity)
    private countryEntity: Repository<CountryEntity>,
  ) {}

  async findLast(): Promise<ICountry | undefined> {
    this.logger.debug('Finding last country from TypeORM');

    const lastCountry = await this.countryEntity.findOne({
      order: { id: 'DESC' },
      where: {},
    });

    if (!lastCountry) return undefined;

    return {
      id: lastCountry.id,
      name: lastCountry.name,
    } as ICountry;
  }
}
