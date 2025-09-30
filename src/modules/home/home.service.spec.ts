import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

/* Project */
import { RedisService } from '@infrastructure/cache';
import { HomeService } from './home.service';
import { StorageService } from '@shared/services';

describe('ApiService', () => {
  let apiService: HomeService;
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [],
      providers: [RedisService, StorageService, HomeService],
    })
      .overrideProvider(RedisService)
      .useValue({ getKeys: jest.fn().mockResolvedValue([]) })
      .overrideProvider(StorageService)
      .useValue({
        generateReadSignedUrl: jest.fn().mockResolvedValue('https://test.com'),
      })
      .compile();

    apiService = module.get<HomeService>(HomeService);
    storageService = module.get<StorageService>(StorageService);

    await module.init();
  });

  it('should be defined', () => {
    expect(apiService).toBeDefined();
    expect(storageService).toBeDefined();
  });

  it('should "getLastCountry" works', async () => {
    jest.spyOn(QueryBus.prototype, 'execute').mockResolvedValue({});

    const result = await apiService.getLastCountry();

    expect(result).toBeDefined();
    expect(result).toStrictEqual({});
  });

  it('should "getCacheKeys" works', async () => {
    const result = await apiService.getCacheKeys();

    expect(result).toBeDefined();
    expect(result).toStrictEqual([]);
  });

  it('should "presignReadURL" works', async () => {
    const result = await apiService.presignReadURL('demo.test');

    expect(result).toBeDefined();
    expect(result).toStrictEqual({ url: 'https://test.com' });

    expect(storageService.generateReadSignedUrl).toHaveBeenCalledTimes(1);
  });
});
