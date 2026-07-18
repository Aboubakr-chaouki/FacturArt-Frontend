import { z } from "zod";
import { documentLineSchema } from "./quote.schema";

export const createInvoiceSchema = z.object({
  clientId: z.number().min(1, "Veuillez sélectionner un client"),
  quoteId: z.number().optional(),
  issueDate: z.string().min(1, "La date d'émission est requise"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  status: z.enum(['EN_ATTENTE', 'PAYEE', 'EN_RETARD', 'ANNULEE']),
  paymentMethod: z.string().optional(),
  lines: z.array(documentLineSchema).min(1, "Au moins une ligne est requise"),
});

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;
