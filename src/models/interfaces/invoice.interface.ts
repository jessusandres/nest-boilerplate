export interface IInvoice {
  customerId: string;
  codigoClienteSap: string;
  sapInvoice: number;
  invoice: string;
  createdAt?: Date;
  updatedAt?: Date;
}
