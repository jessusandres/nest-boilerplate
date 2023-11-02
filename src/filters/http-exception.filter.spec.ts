import { Test } from '@nestjs/testing';
import { BadRequestException, INestApplication } from '@nestjs/common';

/* Extra */
import * as request from 'supertest';

/* Project */
import { AppModule } from '../app.module';
import { ApiService } from '../services';
import { ApiModule } from '../modules';
import { HttpExceptionFilter } from './http-exception.filter';
import {
  argumentsHostMock,
  mockGetRequest,
  mockGetResponse,
  mockStatus,
} from '../../test/mocks';

describe('HttpExceptionFilter', () => {
  let app: INestApplication;
  let apiService: ApiService;
  let httpExceptionFilter: HttpExceptionFilter;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, ApiModule],
      providers: [HttpExceptionFilter],
    })
      .overrideProvider(ApiService)
      .useValue({
        syncData: jest.fn().mockResolvedValue([]),
      })
      .compile();

    app = moduleRef.createNestApplication();

    apiService = moduleRef.get<ApiService>(ApiService);

    // Init global filter
    app.useGlobalFilters(new HttpExceptionFilter());
    httpExceptionFilter =
      moduleRef.get<HttpExceptionFilter>(HttpExceptionFilter);

    await app.init();
  });

  it('should be defined', () => {
    expect(httpExceptionFilter).toBeDefined();
  });

  it(`should return a bad request exception`, async () => {
    jest.spyOn(apiService, 'syncData').mockImplementation(() => {
      throw new BadRequestException('Test');
    });

    return request(app.getHttpServer())
      .post('/api')
      .expect((res) => {
        expect(res.status).toBe(400);
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

  it('should "catch" works', async () => {
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
