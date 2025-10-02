import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

/* Project */
import { RedisService } from '@infrastructure/cache';
import { StorageService } from '@shared/services';
import { FindLastCountryQuery } from './queries/impl';
import { FindLastCountryResponse } from './dto';

@Injectable()
export class HomeService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly redisService: RedisService,
    private readonly storageService: StorageService,
  ) {}

  async getLastCountry(): Promise<FindLastCountryResponse | undefined> {
    return this.queryBus.execute(new FindLastCountryQuery());
  }

  async getCacheKeys() {
    return this.redisService.getKeys('*');
  }

  async presignReadURL(filename: string): Promise<{ url: string }> {
    const url = await this.storageService.generateReadSignedUrl(filename);

    return { url };
  }

  async presignUploadReadURL(filename: string): Promise<{ url: string }> {
    const uploadSignedUrl =
      await this.storageService.generateUploadSignedUrl(filename);

    return { url: uploadSignedUrl };
  }
}
