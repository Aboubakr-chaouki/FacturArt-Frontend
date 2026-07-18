import { z } from "zod";

export const loginFormSchema = z.object({
    email:    z.string().email("Adresse email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
    remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;