import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/* External */
import { createClient } from '@redis/client';
import KeyvRedis, { KeyvRedisOptions, RedisClientOptions } from '@keyv/redis';
import Keyv from 'keyv';

export const KeyvRedisFactory = (configService: ConfigService) => {
  const logger = new Logger('KeyvRedisFactory');

  const enableRedis = configService.get<string>('ENABLE_REDIS') == 'true';

  if (!enableRedis) {
    logger.debug('Redis factory is disabled');

    return {
      stores: [],
    };
  }

  const host = configService.get<string>('REDIS_HOST');
  const baseCA = configService.get<string>('REDIS_CA');
  const port = +configService.get('REDIS_PORT');
  const username = configService.get<string>('REDIS_USERNAME');
  const password = configService.get<string>('REDIS_PASSWORD');
  const url = `redis://${username}:${password}@${host}:${port}`;

  const socketOptions = {};

  if (baseCA) {
    socketOptions['tls'] = true;
    socketOptions['rejectUnauthorized'] = false;
    socketOptions['ca'] = Buffer.from(baseCA, 'base64').toString('utf8');
  }

  const redisClientOptions: RedisClientOptions = {
    url,
    username,
    password,
    socket: {
      ...socketOptions,
      reconnectStrategy: () => false,
    },
    disableOfflineQueue: true,
  };

  const redisOptions: KeyvRedisOptions = {
    namespace: configService.get('APP_NAME') || 'default',
    throwOnErrors: false,
    throwOnConnectError: false,
  };

  const redisClient = createClient(redisClientOptions);

  redisClient.on('error', (err) => {
    logger.warn(`Redis client error: ${err.message}`);
  });

  const redisStore = new KeyvRedis(redisClient, redisOptions);

  const cacheStore = new Keyv({
    store: redisStore,
    namespace: configService.get('APP_NAME') || 'default',
    useKeyPrefix: false,
  });

  cacheStore.on('error', (error) => {
    logger.warn(`Redis error: ${error.message}`);
  });

  cacheStore.on('connect', () => {
    logger.log('Redis connected');
  });

  return {
    stores: [cacheStore],
  };
};
