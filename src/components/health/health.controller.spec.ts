import { Test, TestingModule } from '@nestjs/testing';
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  SequelizeHealthIndicator,
} from '@nestjs/terminus';

/* Project */
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckService: HealthCheckService;
  let sequelizeHealthIndicator: SequelizeHealthIndicator;
  let diskHealthIndicator: DiskHealthIndicator;
  let memoryHealthIndicator: MemoryHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthCheckService,
        SequelizeHealthIndicator,
        DiskHealthIndicator,
        MemoryHealthIndicator,
      ],
    })
      .overrideProvider(HealthCheckService)
      .useValue({
        check: jest.fn(),
      })
      .overrideProvider(SequelizeHealthIndicator)
      .useValue({
        pingCheck: jest.fn(),
      })
      .overrideProvider(DiskHealthIndicator)
      .useValue({
        checkStorage: jest.fn(),
      })
      .overrideProvider(MemoryHealthIndicator)
      .useValue({
        checkHeap: jest.fn(),
      })
      .compile();

    healthController = module.get<HealthController>(HealthController);

    healthCheckService = module.get<HealthCheckService>(HealthCheckService);

    sequelizeHealthIndicator = module.get<SequelizeHealthIndicator>(
      SequelizeHealthIndicator,
    );
    diskHealthIndicator = module.get<DiskHealthIndicator>(DiskHealthIndicator);
    memoryHealthIndicator = module.get<MemoryHealthIndicator>(
      MemoryHealthIndicator,
    );

    await module.init();
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
    expect(healthCheckService).toBeDefined();
    expect(sequelizeHealthIndicator).toBeDefined();
    expect(diskHealthIndicator).toBeDefined();
    expect(memoryHealthIndicator).toBeDefined();
  });

  it('should "check" works', async () => {
    const checkerFn = jest.fn().mockImplementationOnce((checkers: any[]) => {
      checkers.map((c) => c());

      return true;
    });

    jest.spyOn(healthCheckService, 'check').mockImplementationOnce(checkerFn);

    const result = await healthController.check();

    expect(result).toBeDefined();
    expect(healthCheckService.check).toHaveBeenCalledTimes(1);
    expect(sequelizeHealthIndicator.pingCheck).toHaveBeenCalledTimes(1);
    expect(diskHealthIndicator.checkStorage).toHaveBeenCalledTimes(1);
    expect(memoryHealthIndicator.checkHeap).toHaveBeenCalledTimes(1);
  });
});
