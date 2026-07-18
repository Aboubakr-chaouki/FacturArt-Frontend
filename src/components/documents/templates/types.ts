import { DocumentLine } from "@/lib/configs/interface/quote";

export type DocumentType = 'INVOICE' | 'QUOTE';

export interface CompanySettings {
  companyName: string;
  companyAddress: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  siret?: string;
  tvaIntra?: string;
  legalForm?: string;
  capital?: string;
  rcs?: string;
  logoUrl?: string;
  footerText?: string;
  primaryColor: string;
  secondaryColor: string;
  template: string;
}

export interface DocumentData {
  type: DocumentType;
  number: string;
  issueDate: string;
  dueDate?: string; // Pour les factures
  validityDate?: string; // Pour les devis
  status: string;
  client: {
    name: string;
    company?: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  items: DocumentLine[];
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  notes?: string;
}

export interface TemplateProps {
  data: DocumentData;
  settings: CompanySettings;
}
