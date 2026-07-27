import { DocumentLine, DocumentLineRequest } from './quote';

export interface DocumentClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  phone?: string;
  companyName?: string;
  type: string;
  addressLine1?: string;
  postalCode?: string;
  city?: string;
}

export interface BaseDocument {
  id: number;
  client: DocumentClient;
  issueDate: string;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  lines: DocumentLine[];
  createdAt: string;
  notes?: string;
}

export interface BaseCreateDocumentRequest {
  clientId: number;
  issueDate: string;
  lines: DocumentLineRequest[];
}
