export type QuoteStatus = 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'CONVERTI' | 'REFUSE';

export interface DocumentLine {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  tvaRate: number;
  totalHt: number;
  unit?: string;
}

export interface DocumentLineRequest {
  description: string;
  quantity: number;
  unitPrice: number;
  tvaRate: number;
  unit?: string;
}

export interface Quote {
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
    addressLine1?: string;
    postalCode?: string;
    city?: string;
  };
  quoteNumber: string;
  status: QuoteStatus;
  issueDate: string;
  validityDate: string;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  notes?: string;
  lines: DocumentLine[];
  createdAt: string;
  invoiceNumber?: string;
  invoiceCreatedAt?: string;
  validationToken?: string;
}

export interface ArtisanInfo {
  firstName: string;
  lastName: string;
  nomCommercial?: string;
  adresseSiege?: string;
  telephonePro?: string;
  emailPro?: string;
  email?: string; // Fallback
  logo?: string;
  siret?: string;
  numeroTva?: string;
  rcs?: string;
  capital?: string;
  formeJuridique?: string;
  primaryColor?: string;
  secondaryColor?: string;
  documentTemplate?: string;
}

export interface PublicQuoteResponse {
  quoteNumber: string;
  status: QuoteStatus;
  issueDate: string;
  validityDate: string;
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  notes?: string;
  lines: DocumentLine[];
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
    type: string;
    addressLine1?: string;
    postalCode?: string;
    city?: string;
  };
  artisan: ArtisanInfo;
  invoiceNumber?: string;
  invoiceId?: number;
}

export interface CreateQuoteRequest {
  clientId: number;
  issueDate: string;
  validityDate: string;
  status?: QuoteStatus;
  notes?: string;
  lines: DocumentLineRequest[];
}
