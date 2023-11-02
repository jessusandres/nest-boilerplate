/* Extra */
import {
  Column,
  CreatedAt,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

/* Project */
import { IInvoice } from './interfaces';

@Table({ tableName: 'invoice' })
export class InvoiceEntity extends Model implements IInvoice {
  @PrimaryKey
  @Column({ field: 'customerId' })
  customerId: string;

  @PrimaryKey
  @Column({ field: 'codigo_cliente_sap' })
  codigoClienteSap: string;

  @PrimaryKey
  @Column({ field: 'sapInvoice' })
  sapInvoice: number;

  @Column
  invoice: string;

  @Column({ field: 'createdAt' })
  @CreatedAt
  createdAt: Date;

  @Column({ field: 'updatedAt' })
  @UpdatedAt
  updatedAt: Date;
}
