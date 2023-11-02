import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

/* Extra */
import * as request from 'supertest';

/* Project */
import { AppModule } from '../app.module';
import { ApiService } from '../services';
import { ApiModule } from '../modules';
import { TypeExceptionFilter } from './type-exception.filter';
import {
  argumentsHostMock,
  mockGetRequest,
  mockGetResponse,
  mockStatus,
} from '../../test/mocks';

describe('TypeExceptionFilter', () => {
  let app: INestApplication;
  let apiService: ApiService;
  let typeExceptionFilter: TypeExceptionFilter;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, ApiModule],
      providers: [TypeExceptionFilter],
    })
      .overrideProvider(ApiService)
      .useValue({
        syncData: jest.fn().mockResolvedValue(null),
      })
      .compile();

    app = moduleRef.createNestApplication();

    apiService = moduleRef.get<ApiService>(ApiService);

    // Init global filter
    app.useGlobalFilters(new TypeExceptionFilter());
    typeExceptionFilter =
      moduleRef.get<TypeExceptionFilter>(TypeExceptionFilter);

    await app.init();
  });

  it('should be defined', () => {
    expect(typeExceptionFilter).toBeDefined();
  });

  it(`should return a type exception`, async () => {
    jest.spyOn(apiService, 'syncData').mockImplementation(() => {
      const value = null;
      value.f();

      return null;
    });

    return request(app.getHttpServer())
      .post('/api')
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

  it('should "catch" works', async () => {
    typeExceptionFilter.catch(new TypeError('Good test'), argumentsHostMock);

    expect(argumentsHostMock.switchToHttp).toBeCalledTimes(1);
    expect(mockGetResponse).toBeCalledTimes(1);
    expect(mockGetRequest).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledTimes(1);
  });
});
