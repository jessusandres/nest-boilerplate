import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger } from '@nestjs/common';

/* Project */
import { RedisService } from './redis.service';
import { minutesInMilliseconds } from '@shared/utils';

describe('RedisService (ENABLED)', () => {
  let redisService: RedisService;
  let cache: {
    get: jest.Mock;
    set: jest.Mock;
    del: jest.Mock;
    mdel: jest.Mock;
    stores: any;
    disconnect: jest.Mock;
  };
  let configService: ConfigService;

  beforeEach(async () => {
    const cacheClient = {
      keys: jest.fn().mockResolvedValue(['default:prefix:TEST', 'other:TEST']),
    };

    cache = {
      get: jest.fn().mockResolvedValue('HI'),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
      mdel: jest.fn().mockResolvedValue(undefined),
      stores: [{ namespace: 'default', store: { _client: cacheClient } }],
      disconnect: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: CACHE_MANAGER, useValue: cache },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'ENABLE_REDIS') return 'true';
              if (key === 'CACHE_TIMEOUT') return undefined; // default to 1 minute internally

              return undefined;
            }),
          },
        },
      ],
    }).compile();

    module.useLogger(new Logger('RedisServiceEnabled'));

    redisService = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);

    await module.init();
  });

  it('should be defined', () => {
    expect(redisService).toBeDefined();
    expect(configService).toBeDefined();
    expect(cache).toBeDefined();
  });

  it('get should return value and call cache.get', async () => {
    const key = 'TEST';

    const result = await redisService.get(key);

    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledWith(key);
    expect(result).toBe('HI');
  });

  it('get should catch errors and return null', async () => {
    const key = 'TEST';
    cache.get.mockRejectedValueOnce(new Error('Testing err'));

    const result = await redisService.get(key);

    expect(cache.get).toHaveBeenCalledTimes(1);
    expect(cache.get).toHaveBeenCalledWith(key);
    expect(result).toBeNull();
  });

  it('set should call cache.set', async () => {
    const key = 'TEST';
    const value = 'HI';

    const result = await redisService.set(key, value);

    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(key, value);
    expect(result).toBeUndefined();
  });

  it('set should catch errors and still resolve', async () => {
    const key = 'TEST';
    const value = 'HI';

    cache.set.mockRejectedValueOnce(new Error('Testing err'));

    const result = await redisService.set(key, value);

    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(key, value);
    expect(result).toBeUndefined();
  });

  it('delete should call cache.del', async () => {
    const key = 'TEST';

    const result = await redisService.delete(key);

    expect(cache.del).toHaveBeenCalledTimes(1);
    expect(cache.del).toHaveBeenCalledWith(key);
    expect(result).toBeUndefined();
  });

  it('delete should catch errors', async () => {
    const key = 'TEST';

    cache.del.mockRejectedValueOnce(new Error('Testing err'));

    const result = await redisService.delete(key);

    expect(cache.del).toHaveBeenCalledTimes(1);
    expect(cache.del).toHaveBeenCalledWith(key);
    expect(result).toBeUndefined();
  });

  it('setWithExpiry should call cache.set with ttl in ms', async () => {
    const key = 'TEST';
    const value = 'TEST';

    const result = await redisService.setWithExpiry(key, value, 7);

    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(
      key,
      value,
      minutesInMilliseconds(7),
    );
    expect(result).toBeUndefined();
  });

  it('setWithExpiry should catch errors', async () => {
    const key = 'TEST';
    const value = 'TEST';

    cache.set.mockRejectedValueOnce(new Error('Testing err'));
    const result = await redisService.setWithExpiry(key, value, 7);

    expect(cache.set).toHaveBeenCalledTimes(1);
    expect(cache.set).toHaveBeenCalledWith(
      key,
      value,
      minutesInMilliseconds(7),
    );
    expect(result).toBeUndefined();
  });

  it('resetValuesByKeys should compute and call mdel with matching keys including namespace', async () => {
    const keys = ['TEST', ''];

    const result = await redisService.resetValuesByKeys(keys);

    expect(cache.stores[0].store._client.keys).toHaveBeenCalledTimes(1);
    expect(cache.stores[0].store._client.keys).toHaveBeenCalledWith('*');
    expect(cache.mdel).toHaveBeenCalledTimes(1);
    expect(cache.mdel).toHaveBeenCalledWith(['default:prefix:TEST']);
    expect(result).toBeUndefined();
  });

  it('resetValuesByKeys should do nothing with empty keys', async () => {
    const keys = ['  ', ''];

    const result = await redisService.resetValuesByKeys(keys);

    expect(cache.stores[0].store._client.keys).not.toHaveBeenCalled();
    expect(cache.mdel).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe('RedisService (DISABLED)', () => {
  let redisService: RedisService;
  let cache: any;

  beforeEach(async () => {
    const cacheClient = { keys: jest.fn().mockResolvedValue([]) };

    cache = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      mdel: jest.fn(),
      stores: [{ namespace: 'default', store: { _client: cacheClient } }],
      disconnect: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: CACHE_MANAGER, useValue: cache },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'ENABLE_REDIS') return false;
              if (key === 'CACHE_TIMEOUT') return undefined;
              return undefined;
            }),
          },
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
  });

  it('get should return undefined and not call cache when disabled', async () => {
    const result = await redisService.get('TEST');
    expect(cache.get).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('set/delete/setWithExpiry should not call cache when disabled', async () => {
    await redisService.set('A', 'B');
    await redisService.delete('A');
    await redisService.setWithExpiry('A', 'B', 10);

    expect(cache.set).not.toHaveBeenCalled();
    expect(cache.del).not.toHaveBeenCalled();
  });
});
