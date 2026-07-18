import { z } from "zod"

export const createClientSchema = z.object({
    lastName:        z.string().min(2, "Min 2 caractères").max(100).trim(),
    firstName:       z.string().min(2, "Min 2 caractères").max(100).trim(),
    email:           z.string().email("Email invalide").trim().toLowerCase(),
    phone:           z.string().min(10).max(20).regex(/^[0-9+\s()-]+$/, "Format invalide").trim(),
    addressLine1:    z.string().min(5, "Min 5 caractères").trim(),
    addressLine2:    z.string().optional().or(z.literal("")),
    postalCode:      z.string().min(5, "Min 5 caractères").trim(),
    city:            z.string().min(2, "Min 2 caractères").trim(),
    isProfessionnel: z.boolean().default(false),
    companyName:     z.string().max(100).optional().or(z.literal("")),
    siret:           z.string().optional().or(z.literal("")),
    notes:           z.string().optional().or(z.literal("")),
})

export const updateClientSchema = createClientSchema.partial()

export type CreateClientFormData = z.infer<typeof createClientSchema>
export type UpdateClientFormData = z.infer<typeof updateClientSchema>