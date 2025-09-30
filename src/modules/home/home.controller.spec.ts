import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

/* Project */
import { ApiResponse } from '@shared/dto';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

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
        presignReadURL: jest
          .fn()
          .mockResolvedValue({ url: 'https://test.com' }),
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

  it('should "presignURL" works', async () => {
    const result = await controller.presignURL('demo.test');

    expect(result).toBeDefined();
    expect(result).toStrictEqual(
      new ApiResponse({ url: 'https://test.com' }, HttpStatus.OK),
    );

    expect(apiService.presignReadURL).toHaveBeenCalledTimes(1);
  });

  it('should "createCountry" works', async () => {
    const payload = { name: 'Test' };
    const result = await controller.createCountry(payload);

    expect(result).toBeDefined();
    expect(result).toStrictEqual(
      new ApiResponse({ name: payload.name, id: 0 }, HttpStatus.CREATED),
    );
  });
});
