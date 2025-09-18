import { Query } from '@nestjs/cqrs';

/* Project */
import { FindLastCountryQueryResult } from '../interfaces';

export class FindLastCountryQuery extends Query<
  FindLastCountryQueryResult | undefined
> {
  constructor() {
    super();
  }
}
