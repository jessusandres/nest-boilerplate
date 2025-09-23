import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  Logger,
} from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/cache-manager';

/* External */
import * as request from 'supertest';

/* Project */
import { HttpExceptionFilter } from './http-exception.filter';
import {
  argumentsHostMock,
  mockGetRequest,
  mockGetResponse,
  mockStatus,
} from '@tests/mocks/HttpContext.mock';
import { HomeController } from '@modules/home/home.controller';
import { RedisService } from '@infrastructure/cache';
import { HomeService } from '@modules/home/home.service';

describe('HttpExceptionFilter', () => {
  let app: INestApplication;
  let apiService: HomeService;
  let httpExceptionFilter: HttpExceptionFilter;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule.forRoot(), CacheModule.register()],
      controllers: [HomeController],
      providers: [RedisService, HomeService, HttpExceptionFilter],
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

    apiService = moduleRef.get<HomeService>(HomeService);

    // Init global filter
    app.useGlobalFilters(new HttpExceptionFilter());
    httpExceptionFilter =
      moduleRef.get<HttpExceptionFilter>(HttpExceptionFilter);

    app.useLogger(new Logger());

    await app.init();
  });

  it('should be defined', () => {
    expect(httpExceptionFilter).toBeDefined();
  });

  it(`should return a bad request exception`, async () => {
    jest.spyOn(apiService, 'getLastCountry').mockImplementation(() => {
      throw new BadRequestException('Test');
    });

    return request(app.getHttpServer())
      .get('/')
      .expect((res) => {
        expect(res.status).toBe(HttpStatus.BAD_REQUEST);
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

  it(`should return a not found exception`, async () => {
    return request(app.getHttpServer())
      .post('/api2')
      .expect((res) => {
        expect(res.status).toBe(404);
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
    httpExceptionFilter.catch(
      new BadRequestException('Good test'),
      argumentsHostMock,
    );

    expect(argumentsHostMock.switchToHttp).toBeCalledTimes(1);
    expect(mockGetResponse).toBeCalledTimes(1);
    expect(mockGetRequest).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledTimes(1);
  });
});
