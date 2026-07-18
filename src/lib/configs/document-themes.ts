export const DOCUMENT_TEMPLATES = [
  { id: 'modern', label: 'Modern' },
  { id: 'professional', label: 'Professional' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'elegant', label: 'Elegant' },
  { id: 'creative', label: 'Creative' },
  { id: 'artisan', label: 'Artisan (Classic)' },
  { id: 'pro', label: 'Pro Artisan' },
] as const;

export type DocumentTemplateId = typeof DOCUMENT_TEMPLATES[number]['id'];

export const DEFAULT_COLORS = {
  primary: "#0F172A",
  secondary: "#64748B"
};
