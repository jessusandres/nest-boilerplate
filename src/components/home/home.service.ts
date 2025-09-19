import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

/* Project */
import { RedisService } from '@shared/services';
import { FindLastCountryQuery } from './queries/impl';
import { FindLastCountryResponse } from './dto';

@Injectable()
export class HomeService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly redisService: RedisService,
  ) {}

  async getLastCountry(): Promise<FindLastCountryResponse | undefined> {
    return this.queryBus.execute(new FindLastCountryQuery());
  }

  async getCacheKeys() {
    return this.redisService.getKeys('*');
  }
}
