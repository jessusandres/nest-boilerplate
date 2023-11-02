import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

/* Project */
import { BigqueryService } from './bigquery.service';

jest.mock(
  '@google-cloud/bigquery',
  jest.fn().mockImplementation(() => ({
    BigQuery: jest.fn().mockImplementation(() => ({
      createJob: jest.fn().mockImplementation(() => [
        {
          getQueryResults: jest.fn().mockResolvedValue([[{ name: 'test' }]]),
        },
      ]),
    })),
  })),
);

describe('BigqueryService', () => {
  let bigqueryService: BigqueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, BigqueryService],
    }).compile();

    bigqueryService = module.get<BigqueryService>(BigqueryService);

    await module.init();
  });

  it('should be defined', () => {
    expect(bigqueryService).toBeDefined();
  });

  it('should "createQueryJob" works', async () => {
    const result = await bigqueryService.performJob();

    expect(result).toBeDefined();
  });

  it('should "createQueryJob" works', async () => {
    const result = await bigqueryService.performDemoJob();

    expect(result).toBeDefined();
  });
});
