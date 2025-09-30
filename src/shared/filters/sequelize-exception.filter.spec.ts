import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CacheModule } from '@nestjs/cache-manager';

/* External */
import * as request from 'supertest';
import { AssociationError, ValidationError } from 'sequelize';

/* Project */
import {
  argumentsHostMock,
  mockGetRequest,
  mockGetResponse,
  mockStatus,
} from '@tests/mocks/HttpContext.mock';
import { HomeController } from '@modules/home/home.controller';
import { FindLastCountryResponse } from '@modules/home/dto';
import { HomeService } from '@modules/home/home.service';
import { RedisService } from '@infrastructure/cache';
import { SequelizeExceptionFilter } from './sequelize-exception.filter';

describe('SequelizeExceptionFilter', () => {
  let app: INestApplication;
  let homeService: HomeService;
  let sequelizeExceptionFilter: SequelizeExceptionFilter;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CqrsModule, CacheModule.register()],
      controllers: [HomeController],
      providers: [RedisService, HomeService, SequelizeExceptionFilter],
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
    app.useGlobalFilters(new SequelizeExceptionFilter());
    sequelizeExceptionFilter = moduleRef.get<SequelizeExceptionFilter>(
      SequelizeExceptionFilter,
    );

    app.useLogger(new Logger());

    await app.init();
  });

  it('should be defined', () => {
    expect(sequelizeExceptionFilter).toBeDefined();
  });

  it(`should return a PRECONDITION_FAILED exception`, async () => {
    const mockImplementation = () => {
      throw new ValidationError('boom', []);

      return null;
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
        expect(res.status).toBe(HttpStatus.PRECONDITION_FAILED);
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
