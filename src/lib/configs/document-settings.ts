import { CompanySettings } from "@/components/documents/templates/types";

export interface DocumentSettings extends CompanySettings {
  invoicePrefix: string;
  quotePrefix: string;
  invoiceYear: string;
  quoteYear: string;
}

export const DEFAULT_DOCUMENT_SETTINGS: DocumentSettings = {
  template: "artisan",
  primaryColor: "#0D3D2E",
  secondaryColor: "#2ECC8E",
  invoicePrefix: "INV",
  quotePrefix: "QT",
  invoiceYear: new Date().getFullYear().toString(),
  quoteYear: new Date().getFullYear().toString(),
  companyName: "",
  companyAddress: "",
  companyPhone: "",
  companyEmail: "",
  companyWebsite: "",
  siret: "",
  tvaIntra: "",
  legalForm: "",
  capital: "",
  rcs: "",
  footerText: "Merci de votre confiance.",
  logoUrl: ""
};

export const INVOICE_TEMPLATES = [
  {
    id: "artisan",
    name: "Artisan Classique",
    description: "Le standard de l'artisanat, clair et efficace",
    preview: "Structure traditionnelle avec bordures marquées",
    colors: { primary: "#0D3D2E", secondary: "#2ECC8E" }
  },
  {
    id: "modern",
    name: "Moderne Éclat",
    description: "Design dynamique avec en-tête coloré",
    preview: "Style contemporain, idéal pour les services numériques",
    colors: { primary: "#1E40AF", secondary: "#3B82F6" }
  },
  {
    id: "professional",
    name: "Business Pro",
    description: "Sérieux et structuré pour les entreprises",
    preview: "Mise en page corporate avec badges distinctifs",
    colors: { primary: "#0F172A", secondary: "#334155" }
  },
  {
    id: "pro",
    name: "Pro Artisan",
    description: "Modèle professionnel, simple et lisible, adapté aux artisans",
    preview: "Design épuré, couleurs personnalisables",
    colors: { primary: "#0F172A", secondary: "#64748B" }
  },
  {
    id: "minimalist",
    name: "Épure Minimal",
    description: "L'essentiel sans artifice, très lisible",
    preview: "Design léger, parfait pour une impression économique",
    colors: { primary: "#000000", secondary: "#525252" }
  },
];

export const PRESET_COLORS = [
  { label: "Nature", primary: "#0D3D2E", secondary: "#2ECC8E" },
  { label: "Océan", primary: "#1E40AF", secondary: "#3B82F6" },
  { label: "Nuit", primary: "#0F172A", secondary: "#64748B" },
  { label: "Élégance", primary: "#701A75", secondary: "#D946EF" },
  { label: "Énergie", primary: "#9A3412", secondary: "#F97316" },
  { label: "Charbon", primary: "#18181B", secondary: "#71717A" },
];
