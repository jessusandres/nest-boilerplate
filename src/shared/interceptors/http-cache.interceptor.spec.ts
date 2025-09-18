import { Test } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';

/* Project */
import { HttpCacheInterceptor } from './http-cache.interceptor';

const mockGetRequest = jest.fn().mockReturnValue({});

const mockedContext = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: mockGetRequest,
  }),
  getHandler: jest.fn(),
  getClass: jest.fn(),
};

describe('HttpCacheInterceptor', () => {
  let httpCacheInterceptor: HttpCacheInterceptor;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [HttpCacheInterceptor],
    }).compile();

    httpCacheInterceptor =
      module.get<HttpCacheInterceptor>(HttpCacheInterceptor);

    await module.init();
  });

  it('should be defined', () => {
    expect(httpCacheInterceptor).toBeDefined();
  });

  it('should "trackBy" works', () => {
    httpCacheInterceptor.trackBy(mockedContext as any);

    expect(mockedContext.switchToHttp).toHaveBeenCalledTimes(1);
    expect(mockGetRequest).toHaveBeenCalledTimes(1);
  });
});
