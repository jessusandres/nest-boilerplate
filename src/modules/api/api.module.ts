import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

/* Project */
import { ApiController } from '../../controllers';
import { ApiService, BigqueryService } from '../../services';
import { InvoiceEntity } from '../../models';

@Module({
  imports: [SequelizeModule.forFeature([InvoiceEntity])],
  controllers: [ApiController],
  providers: [ApiService, BigqueryService],
})
export class ApiModule {}
