import { BaseDocument, BaseCreateDocumentRequest } from './document';

export type InvoiceStatus = 'EN_ATTENTE' | 'PAYEE' | 'EN_RETARD' | 'ANNULEE';

export interface Invoice extends BaseDocument {
  quoteId?: number;
  quoteNumber?: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
}

export interface CreateInvoiceRequest extends BaseCreateDocumentRequest {
  quoteId?: number;
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod?: string;
  invoiceNumber?: string;
}
