import { z } from "zod"

export const passwordChangeSchema = z.object({
  oldPassword: z.string().min(1, "L'ancien mot de passe est requis"),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit faire au moins 8 caractères"),
  confirmPassword: z.string().min(1, "La confirmation est requise"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>
