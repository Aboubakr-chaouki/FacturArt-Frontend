// register-form-schema.ts
import { z } from "zod"
import { STATUS_JURIDIQUE } from "@/lib/configs/enums/status-juridique.enums"

// ─── Étape 1 ──────────────────────────────────────────────────────────────────
const step1BaseSchema = z.object({
    firstName: z.string().min(2, "Min 2 caractères").max(50).trim(),
    lastName:  z.string().min(2, "Min 2 caractères").max(50).trim(),
    email:     z.string().email("Email invalide").trim().toLowerCase(),
    password:  z.string().min(8, "8 caractères minimum"),
    confirm:   z.string().min(1, "Confirmez le mot de passe"),
    accepted:  z.boolean().refine(v => v === true, {
        message: "Vous devez accepter les conditions",
    }),
})

export const step1Schema = step1BaseSchema.refine(
    d => d.password === d.confirm,
    {
        message: "Les mots de passe ne correspondent pas",
        path:    ["confirm"],
    }
)

// ─── Étape 2 ──────────────────────────────────────────────────────────────────
export const step2Schema = z.object({
    nomCommercial:  z.string().min(2, "Min 2 caractères").max(200).trim(),
    formeJuridique: z.enum(STATUS_JURIDIQUE),
    siret:          z.string()
        .min(14, "14 chiffres requis")
        .max(14, "14 chiffres maximum")
        .regex(/^\d{14}$/, "Chiffres uniquement"),
    codeApe:        z.string().max(10).optional().or(z.literal("")),
    numeroTva:      z.string().max(20).optional().or(z.literal("")),
    adresseSiege:   z.string().min(5, "Min 5 caractères").trim(),
    telephonePro:   z.string()
        .min(10, "Min 10 caractères")
        .max(20)
        .regex(/^[0-9+\s()-]+$/, "Format invalide"),
    emailPro:       z.string().email("Email invalide").optional().or(z.literal("")),
    logo:           z.any().optional(),
    iban:           z.string().min(14, "IBAN trop court").max(34, "IBAN trop long").trim().optional().or(z.literal("")),
    exonerationTva: z.boolean(),
})

// ─── Types ────────────────────────────────────────────────────────────────────
export type Step1Values = z.infer<typeof step1Schema>
export type Step2Values = z.infer<typeof step2Schema>
