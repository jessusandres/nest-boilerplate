import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

/* Project */
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { ApiResponse } from '../../shared/dto';

describe('HomeController', () => {
  let controller: HomeController;
  let apiService: HomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [HomeController],
      providers: [HomeService],
    })
      .overrideProvider(HomeService)
      .useValue({
        getLastCountry: jest.fn().mockResolvedValue({}),
        getCacheKeys: jest.fn().mockResolvedValue([]),
      })
      .compile();

    controller = module.get<HomeController>(HomeController);
    apiService = module.get<HomeService>(HomeService);

    await module.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(apiService).toBeDefined();
  });

  it('should "getLastCountry" works', async () => {
    const result = await controller.getLastCountry();

    expect(result).toBeDefined();
    expect(result).toStrictEqual(new ApiResponse({}, HttpStatus.OK));
  });

  it('should "cacheKeys" works', async () => {
    const result = await controller.cacheKeys();

    expect(result).toBeDefined();
    expect(result).toStrictEqual(new ApiResponse([], HttpStatus.OK));
  });
});
