/* Project */
import { IInvoice } from '../../src/models/interfaces';

export class InvoiceMock {
  static fromDb(date = new Date()): IInvoice {
    return {
      codigoClienteSap: '',
      customerId: '',
      sapInvoice: 0,
      invoice: 'IV001',
      createdAt: date,
      updatedAt: date,
    };
  }
}
