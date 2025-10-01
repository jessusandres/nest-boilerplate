import { SequelizeCountryRepository } from './sequelize-country.repository';
import { CountryEntity } from '../models';

describe('SequelizeCountryRepository', () => {
  let sequelizeCountryRepository: SequelizeCountryRepository;

  beforeEach(() => {
    sequelizeCountryRepository = new SequelizeCountryRepository(
      jest.mocked(CountryEntity, {
        shallow: true,
      }) as unknown as typeof CountryEntity,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(sequelizeCountryRepository).toBeDefined();
  });

  it('should "findLast" works with data', async () => {
    jest
      .spyOn(CountryEntity, 'findOne')
      .mockResolvedValueOnce({ id: 0, name: 'Test' } as CountryEntity);

    const result = await sequelizeCountryRepository.findLast();

    expect(result).toBeDefined();
    expect(result).toStrictEqual({ id: 0, name: 'Test' });

    expect(CountryEntity.findOne).toHaveBeenCalledTimes(1);
  });

  it('should "findLast" works with empty data', async () => {
    jest.spyOn(CountryEntity, 'findOne').mockResolvedValueOnce(null);

    const result = await sequelizeCountryRepository.findLast();

    expect(result).not.toBeDefined();

    expect(CountryEntity.findOne).toHaveBeenCalledTimes(1);
  });
});
