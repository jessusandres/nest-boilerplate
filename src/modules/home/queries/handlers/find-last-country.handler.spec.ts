import { Test, TestingModule } from '@nestjs/testing';

/* Project */
import {
  COUNTRY_REPOSITORY,
  CountryRepository,
} from '@infrastructure/database/repositories/country.repository';
import { FindLastCountryHandler } from './find-last-country.handler';
import { FindLastCountryQuery } from '../impl';

describe('FindLastCountryHandler', () => {
  let handler: FindLastCountryHandler;
  let repository: jest.Mocked<CountryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindLastCountryHandler,
        {
          provide: COUNTRY_REPOSITORY,
          useValue: {
            findLast: jest.fn(),
          } as jest.Mocked<CountryRepository>,
        },
      ],
    }).compile();

    handler = module.get(FindLastCountryHandler);
    repository = module.get(COUNTRY_REPOSITORY);

    await module.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return the last country when one exists and call repository.findLast', async () => {
    jest.useFakeTimers();

    const mockCountry = { id: 42, name: 'Wakanda' };

    repository.findLast.mockResolvedValueOnce(mockCountry);

    const execPromise = handler.execute(new FindLastCountryQuery());
    jest.runAllTimers();

    const result = await execPromise;

    expect(repository.findLast).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ id: 42, name: 'Wakanda' });
    jest.useRealTimers();
  });

  it('should return undefined when no country exists', async () => {
    jest.useFakeTimers();

    repository.findLast.mockResolvedValueOnce(undefined);

    const execPromise = handler.execute(new FindLastCountryQuery());
    jest.runAllTimers();

    const result = await execPromise;

    expect(result).toBeUndefined();
    jest.useRealTimers();
  });
});
