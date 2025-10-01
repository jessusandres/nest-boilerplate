import { TypeORMCountryRepository } from './typeorm-country.repository';
import { CountryEntity } from '../models';

import { Repository } from 'typeorm';

const entityMock = {
  findOne: jest.fn(),
};

describe('TypeORMCountryRepository', () => {
  let repository: TypeORMCountryRepository;

  beforeEach(() => {
    repository = new TypeORMCountryRepository(
      entityMock as unknown as Repository<CountryEntity>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should "findLast" works with data', async () => {
    entityMock.findOne.mockResolvedValueOnce({
      id: 0,
      name: 'Test',
    });

    const result = await repository.findLast();

    expect(result).toBeDefined();
    expect(result).toStrictEqual({ id: 0, name: 'Test' });

    expect(entityMock.findOne).toHaveBeenCalledTimes(1);
  });

  it('should "findLast" works without data', async () => {
    entityMock.findOne.mockResolvedValueOnce(null);

    const result = await repository.findLast();

    expect(result).not.toBeDefined();

    expect(entityMock.findOne).toHaveBeenCalledTimes(1);
  });
});
