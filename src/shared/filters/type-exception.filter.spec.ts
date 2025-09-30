import { Test } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/cache-manager';

/* External */
import * as request from 'supertest';

/* Project */
import { HomeService } from '@modules/home/home.service';
import { HomeController } from '@modules/home/home.controller';
import {
  argumentsHostMock,
  mockGetRequest,
  mockGetResponse,
  mockStatus,
} from '@tests/mocks/HttpContext.mock';
import { RedisService } from '@infrastructure/cache';
import { FindLastCountryResponse } from '@modules/home/dto';
import { TypeExceptionFilter } from './type-exception.filter';

describe('TypeExceptionFilter', () => {
  let app: INestApplication;
  let homeService: HomeService;
  let typeExceptionFilter: TypeExceptionFilter;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule, CacheModule.register()],
      controllers: [HomeController],
      providers: [RedisService, HomeService, TypeExceptionFilter],
    })
      .overrideProvider(HomeService)
      .useValue({
        getLastCountry: jest.fn().mockResolvedValue(null),
      })
      .overrideProvider(RedisService)
      .useValue({
        getKeys: jest.fn().mockResolvedValue([]),
      })
      .compile();

    app = moduleRef.createNestApplication();

    homeService = moduleRef.get<HomeService>(HomeService);

    // Init global filter
    app.useGlobalFilters(new TypeExceptionFilter());
    typeExceptionFilter =
      moduleRef.get<TypeExceptionFilter>(TypeExceptionFilter);

    app.useLogger(new Logger());

    await app.init();
  });

  it('should be defined', () => {
    expect(typeExceptionFilter).toBeDefined();
  });

  it(`should return a type exception`, async () => {
    const mockImplementation = async () => {
      const value = null;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      value.f();

      return Promise.resolve();
    };

    jest
      .spyOn(homeService, 'getLastCountry')
      .mockImplementation(
        mockImplementation as unknown as () => Promise<
          FindLastCountryResponse | undefined
        >,
      );

    return request(app.getHttpServer())
      .get('/')
      .expect((res) => {
        expect(res.status).toBe(500);
        const json = JSON.parse(res.text);

        expect(json).toEqual(
          expect.objectContaining({
            timestamp: expect.any(String),
            error: {
              code: expect.any(Number),
              clientCode: expect.any(String),
              message: expect.any(String),
            },
          }),
        );
      });
  });

  it('should "catch" works', () => {
    typeExceptionFilter.catch(new TypeError('Good test'), argumentsHostMock);

    expect(argumentsHostMock.switchToHttp).toBeCalledTimes(1);
    expect(mockGetResponse).toBeCalledTimes(1);
    expect(mockGetRequest).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledTimes(1);
  });
});
