import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

/* Extra */
import * as request from 'supertest';
import { AssociationError, Sequelize } from 'sequelize';

/* Project */
import { AppModule } from '../app.module';
import { ApiService } from '../services';
import { ApiModule } from '../modules';
import { SequelizeExceptionFilter } from './sequelize-exception.filter';
import {
  argumentsHostMock,
  mockGetRequest,
  mockGetResponse,
  mockStatus,
} from '../../test/mocks';

describe('SequelizeExceptionFilter', () => {
  let app: INestApplication;
  let apiService: ApiService;
  let sequelizeExceptionFilter: SequelizeExceptionFilter;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, ApiModule],
      providers: [SequelizeExceptionFilter],
    })
      .overrideProvider(ApiService)
      .useValue({
        syncData: jest.fn().mockResolvedValue(null),
      })
      .compile();

    app = moduleRef.createNestApplication();

    apiService = moduleRef.get<ApiService>(ApiService);

    // Init global filter
    app.useGlobalFilters(new SequelizeExceptionFilter());
    sequelizeExceptionFilter = moduleRef.get<SequelizeExceptionFilter>(
      SequelizeExceptionFilter,
    );

    await app.init();
  });

  it('should be defined', () => {
    expect(sequelizeExceptionFilter).toBeDefined();
  });

  it(`should return a bad request exception`, async () => {
    jest.spyOn(apiService, 'syncData').mockImplementation(async () => {
      const instance = new Sequelize('sqlite::memory:');

      await instance.query('SELECT * FROM "nothing"');

      return null;
    });

    return request(app.getHttpServer())
      .post('/api')
      .expect((res) => {
        expect(res.status).toBe(412);
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
    sequelizeExceptionFilter.catch(
      new AssociationError('Test Error'),
      argumentsHostMock,
    );

    expect(argumentsHostMock.switchToHttp).toBeCalledTimes(1);
    expect(mockGetResponse).toBeCalledTimes(1);
    expect(mockGetRequest).toBeCalledTimes(1);
    expect(mockStatus).toBeCalledTimes(1);
  });
});
