// Sort matters when work with package mocks
import {
  KeyvMock,
  KeyvRedisMock,
  redisClientMock,
  connectMock,
} from '@tests/mocks';

import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache, CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

jest.mock('@redis/client', () => redisClientMock);

jest.mock('@keyv/redis', () => ({
  __esModule: true,
  default: KeyvRedisMock,
  KeyvRedisOptions: {} as unknown,
  RedisClientOptions: {} as unknown,
  RedisClientType: {} as unknown,
}));

jest.mock('keyv', () => {
  const ctor = jest.fn().mockImplementation((opts) => new KeyvMock(opts));

  return {
    __esModule: true,
    default: ctor,
    Keyv: ctor,
  };
});

/* Project */
import { KeyvRedisFactory, RedisService } from '@infrastructure/cache';
import Keyv from 'keyv';

describe('RedisFactory ENABLED', () => {
  let cacheManager: Cache;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CacheModule.registerAsync({
          isGlobal: true,
          inject: [ConfigService],
          useFactory: KeyvRedisFactory,
        }),
      ],
      providers: [ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockImplementation((key) => {
          switch (key) {
            case 'ENABLE_REDIS':
              return 'true';
            default:
              return 'test';
          }
        }),
      })
      .compile();

    cacheManager = moduleRef.get(CACHE_MANAGER);

    moduleRef.useLogger(new Logger());

    await moduleRef.init();
  });

  afterEach(async () => {
    await moduleRef?.close();

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(cacheManager).toBeDefined();
  });

  it('should redis client has been called', async () => {
    expect(connectMock).toHaveBeenCalledTimes(1);
  });

  it('should call to Keyv constructor', () => {
    const calls = (Keyv as unknown as jest.Mock).mock.calls;

    // Nest cache manager invokes other calls into the keyv package
    const factoryCalls = calls.filter(
      ([opts]) =>
        opts &&
        opts.store?.constructor?.name === 'KeyvRedisMock' &&
        opts.namespace === 'test' &&
        opts.useKeyPrefix === false,
    );
    expect(factoryCalls).toHaveLength(1);

    expect(Keyv).toHaveBeenCalledWith(
      expect.objectContaining({
        store: expect.anything(),
        namespace: expect.any(String),
      }),
    );
  });
});

describe('RedisFactory DISABLED', () => {
  let cacheManager: Cache;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CacheModule.registerAsync({
          isGlobal: true,
          inject: [ConfigService],
          useFactory: KeyvRedisFactory,
        }),
      ],
      providers: [ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockImplementation((key) => {
          switch (key) {
            case 'ENABLE_REDIS':
              return 'false';
            default:
              return 'test';
          }
        }),
      })
      .compile();

    cacheManager = moduleRef.get(CACHE_MANAGER);

    moduleRef.useLogger(new Logger());

    await moduleRef.init();
  });

  it('should be defined', () => {
    expect(cacheManager).toBeDefined();
    expect(cacheManager).toBeDefined();
  });

  it('should redis client has not been called', async () => {
    expect(connectMock).not.toHaveBeenCalled();
  });
});
