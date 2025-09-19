import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

/* Project */
import { RedisService } from '@shared/services';
import { HomeService } from './home.service';

describe('ApiService', () => {
  let apiService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [],
      providers: [RedisService, HomeService],
    })
      .overrideProvider(RedisService)
      .useValue({ getKeys: jest.fn().mockResolvedValue([]) })
      .compile();

    apiService = module.get<HomeService>(HomeService);

    await module.init();
  });

  it('should be defined', () => {
    expect(apiService).toBeDefined();
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
});
