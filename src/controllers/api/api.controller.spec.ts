import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

/* Project */
import { ApiController } from './api.controller';
import { ApiService } from '../../services';
import { InvoiceMock } from '../../../test/mocks';

const currentDate = new Date();
describe('ApiController', () => {
  let controller: ApiController;
  let apiService: ApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [ApiService],
    })
      .overrideProvider(ApiService)
      .useValue({
        getLast10: jest
          .fn()
          .mockResolvedValue([InvoiceMock.fromDb(currentDate)]),
        syncData: jest.fn().mockResolvedValue([]),
      })
      .compile();

    controller = module.get<ApiController>(ApiController);
    apiService = module.get<ApiService>(ApiService);

    await module.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(apiService).toBeDefined();
  });

  it('should "getLast10" works', async () => {
    const result = await controller.getLast10();

    expect(result).toBeDefined();
    expect(result).toStrictEqual({
      code: HttpStatus.OK,
      data: [InvoiceMock.fromDb(currentDate)],
      metadata: {},
    });
  });

  it('should "syncData" works', async () => {
    const result = await controller.syncData();

    expect(result).toBeDefined();
    expect(result).toStrictEqual({
      code: HttpStatus.OK,
      data: [],
      metadata: {},
    });
  });
});
