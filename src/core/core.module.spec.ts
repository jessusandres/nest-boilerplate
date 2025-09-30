import { Test, TestingModule } from '@nestjs/testing';

/* Project */
import { HealthModule } from '@core/health/health.module';
import { CoreModule } from './core.module';

describe('CoreModule', () => {
  let moduleRef: TestingModule;
  let healthModule: HealthModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile();

    healthModule = moduleRef.get(HealthModule);

    await moduleRef.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should compile successfully within a TestingModule', async () => {
    expect(moduleRef).toBeDefined();
    expect(healthModule).toBeDefined();
  });
});
