export type InvoiceStatus = 'EN_ATTENTE' | 'PAYEE' | 'EN_RETARD' | 'ANNULEE';

import { DocumentLine, DocumentLineRequest } from './quote';

export interface Invoice {
  id: number;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    phone?: string;
    companyName?: string;
    type: string;
  };
  quoteId?: number;
  quoteNumber?: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  lines: DocumentLine[];
  createdAt: string;
}

export interface CreateInvoiceRequest {
  clientId: number;
  quoteId?: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod?: string;
  lines: DocumentLineRequest[];
  invoiceNumber?: string; // Optionnel : numéro généralisé par le client
}
