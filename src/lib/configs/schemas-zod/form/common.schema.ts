import { z } from "zod";

export const documentLineSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  quantity:    z.number().min(0.01, "La quantité doit être supérieure à 0"),
  unitPrice:   z.number().min(0, "Le prix unitaire doit être positif"),
  tvaRate:     z.number().min(0, "Le taux de TVA doit être positif"),
  unit:        z.string().optional(),
  totalHt:     z.number().optional(),
});

export type DocumentLineFormValues = z.infer<typeof documentLineSchema>;
