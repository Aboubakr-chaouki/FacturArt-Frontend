import { z } from "zod";

export const documentLineSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  quantity: z.number().min(0.01, "La quantité doit être supérieure à 0"),
  unitPrice: z.number().min(0, "Le prix unitaire doit être positif"),
  tvaRate: z.number().min(0, "Le taux de TVA doit être positif"),
  unit: z.string().optional(),
});

export const createQuoteSchema = z.object({
  clientId: z.number().min(1, "Veuillez sélectionner un client"),
  issueDate: z.string().min(1, "La date d'émission est requise"),
  validityDate: z.string().min(1, "La date de validité est requise"),
  status: z.enum(['BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE']).optional(),
  notes: z.string().optional(),
  lines: z.array(documentLineSchema).min(1, "Au moins une ligne est requise"),
});

export type CreateQuoteFormData = z.infer<typeof createQuoteSchema>;
export type DocumentLineFormData = z.infer<typeof documentLineSchema>;
