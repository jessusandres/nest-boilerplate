import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

/* External */
import { RedisClientType } from '@keyv/redis';

/* Project */
import { minutesInMilliseconds } from '@shared/utils';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly ENABLE_REDIS: boolean = false;
  private readonly CACHE_TIMEOUT: number;
  private readonly NAMESPACE: string;

  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.CACHE_TIMEOUT = 60 * (this.configService.get('CACHE_TIMEOUT') || 1);

    this.ENABLE_REDIS =
      this.configService.get<string>('ENABLE_REDIS') === 'true';

    this.logger.debug(`Redis is ${this.ENABLE_REDIS ? 'enabled' : 'disabled'}`);

    this.NAMESPACE = this.cacheManager.stores[0]?.namespace || 'default';

    this.logger.debug(`Using redis namespace: ${this.NAMESPACE}`);
  }

  private get redisClient(): RedisClientType {
    const redisStore: any = this.cacheManager['stores'][0].store;

    return redisStore._client as RedisClientType;
  }

  async getKeys(pattern: string): Promise<string[]> {
    if (!this.ENABLE_REDIS) return [];

    // return await this.redisClient.keys(pattern);
    return this.redisClient.keys(pattern).catch((reason) => {
      this.logger.error(reason);
      return [];
    });
  }

  async get(key: string): Promise<string | null | undefined> {
    this.logger.debug(`Getting redis value for ${key}`);

    if (this.ENABLE_REDIS) {
      return this.cacheManager.get<string>(key).catch((reason) => {
        this.logger.error(reason);
        return null;
      });
    }

    return undefined;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.logger.debug(`Setting redis value for ${key}`);

    if (this.ENABLE_REDIS) {
      await this.cacheManager
        .set(key, value)
        .catch((reason) => this.logger.error(reason));
    }
  }

  async setWithExpiry<T>(
    key: string,
    value: T,
    expiry: number = this.CACHE_TIMEOUT,
  ): Promise<void> {
    this.logger.debug(
      `Setting redis value for ${key} with expiration [${expiry}]`,
    );

    const ttl = Number.isNaN(expiry) ? this.CACHE_TIMEOUT : expiry;

    if (this.ENABLE_REDIS) {
      await this.cacheManager
        .set(key, value, minutesInMilliseconds(ttl))
        .catch((reason) => this.logger.error(reason));
    }
  }

  async delete(key: string): Promise<void> {
    this.logger.debug(`Deleting redis value for ${key}`);

    if (this.ENABLE_REDIS) {
      await this.cacheManager
        .del(key)
        .catch((reason) => this.logger.error(reason));
    }
  }

  async resetValuesByKeys(keys: string[]) {
    const mappedKeys = keys
      .map((key) => {
        if (key) return key.toString().trim();

        return '';
      })
      .filter((k) => k !== '');

    if (!mappedKeys.length) return;

    this.logger.warn(`Cache keys to find: ${JSON.stringify(mappedKeys)}`);

    const allRedisKeys = await this.redisClient.keys('*');

    const keysToDelete = allRedisKeys
      .map((rk) => rk.toString())
      .filter((rk: string) =>
        mappedKeys.find(
          (mk: string) => rk.includes(mk) && rk.includes(this.NAMESPACE),
        ),
      );

    this.logger.warn(`Deleting values by : ${JSON.stringify(keysToDelete)}`);

    if (keysToDelete.length)
      await this.cacheManager
        .mdel(keysToDelete)
        .catch((reason) => this.logger.error(reason));
  }

  onModuleDestroy(): void {
    this.cacheManager?.disconnect();
  }
}
