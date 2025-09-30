import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

/* Project */
import { CountryEntity } from '@infrastructure/database/models';
import { FindLastCountryHandler } from './find-last-country.handler';
import { FindLastCountryQuery } from '../impl';

describe('FindLastCountryHandler', () => {
  let handler: FindLastCountryHandler;
  let countryModel: typeof CountryEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindLastCountryHandler,
        {
          provide: getModelToken(CountryEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(FindLastCountryHandler);
    countryModel = module.get(getModelToken(CountryEntity));

    await module.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return the last country when one exists and call findOne with expected options', async () => {
    const mockCountry = { id: 42, name: 'Wakanda' };

    jest
      .spyOn(countryModel, 'findOne')
      .mockResolvedValueOnce(mockCountry as unknown as CountryEntity);

    const execPromise = handler.execute(new FindLastCountryQuery());

    const result = await execPromise;

    expect(countryModel.findOne).toHaveBeenCalledWith({
      limit: 1,
      order: [['id', 'DESC']],
    });

    expect(result).toEqual({ id: 42, name: 'Wakanda' });
  });

  it('should return undefined when no country exists', async () => {
    jest
      .spyOn(countryModel, 'findOne')
      .mockResolvedValueOnce(null as unknown as CountryEntity);

    const execPromise = handler.execute(new FindLastCountryQuery());

    const result = await execPromise;

    expect(result).toBeUndefined();
  });
});
