import { z } from "zod";
import { documentLineSchema } from "./common.schema";

export const createQuoteSchema = z.object({
  clientId: z.number().min(1, "Veuillez sélectionner un client"),
  issueDate: z.string().min(1, "La date d'émission est requise"),
  validityDate: z.string().min(1, "La date de validité est requise"),
  status: z.enum(['BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE']).optional(),
  notes: z.string().optional(),
  lines: z.array(documentLineSchema).min(1, "Au moins une ligne est requise"),
});

export type CreateQuoteFormData = z.infer<typeof createQuoteSchema>;
