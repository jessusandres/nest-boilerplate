import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';

/* Project */
import { ApiService } from './api.service';
import { InvoiceEntity } from '../../models';
import { InvoiceMock } from '../../../test/mocks';
import { BigqueryService } from '../bigquery/bigquery.service';

const currentDate = new Date();

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        {
          provide: getModelToken(InvoiceEntity),
          useValue: {
            findAll: jest.fn(() => [InvoiceMock.fromDb(currentDate)]),
          },
        },
        BigqueryService,
      ],
    })
      .overrideProvider(BigqueryService)
      .useValue({
        performJob: jest.fn().mockResolvedValue([]),
      })
      .compile();

    apiService = module.get<ApiService>(ApiService);

    await module.init();
  });

  it('should be defined', () => {
    expect(apiService).toBeDefined();
  });

  it('should "getLast10" works', async () => {
    const result = await apiService.getLast10();

    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toStrictEqual(InvoiceMock.fromDb(currentDate));
  });

  it('should "syncData" works', async () => {
    const result = await apiService.syncData();

    expect(result).toBeDefined();
    expect(result).toHaveLength(0);
  });
});
