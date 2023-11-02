import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

/* Project */
import { InvoiceEntity } from '../../models';
import { BigqueryService } from '../bigquery/bigquery.service';

@Injectable()
export class ApiService {
  constructor(
    @InjectModel(InvoiceEntity)
    private readonly invoiceEntity: typeof InvoiceEntity,
    private readonly bigqueryService: BigqueryService,
  ) {}

  async getLast10() {
    return await this.invoiceEntity.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
    });
  }

  async syncData() {
    return this.bigqueryService.performJob();
  }
}
