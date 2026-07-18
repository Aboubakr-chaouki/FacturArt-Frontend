import { z } from "zod"
import { STATUS_JURIDIQUE } from "@/lib/configs/enums/status-juridique.enums"

export const profileFormSchema = z.object({
    firstName: z.string().min(2, "Le prénom est trop court").trim(),
    lastName:  z.string().min(2, "Le nom est trop court").trim(),
    email:     z.string().email("Email invalide").trim().toLowerCase(),
    
    nomCommercial:  z.string().min(2, "Le nom commercial est requis").trim(),
    formeJuridique: z.enum(STATUS_JURIDIQUE),
    siret:          z.string().length(14, "Le SIRET doit faire 14 chiffres").regex(/^\d+$/, "Chiffres uniquement"),
    codeApe:        z.string().max(10).optional().or(z.literal("")),
    numeroTva:      z.string().max(20).optional().or(z.literal("")),
    adresseSiege:   z.string().min(5, "L'adresse est trop courte").trim(),
    telephonePro:   z.string().min(10, "Format invalide").max(20),
    emailPro:       z.string().email("Email invalide").optional().or(z.literal("")),
    iban:           z.string().min(14, "IBAN invalide").max(34).optional().or(z.literal("")),
    rcs:            z.string().max(50).optional().or(z.literal("")),
    capital:        z.string().max(50).optional().or(z.literal("")),
    exonerationTva: z.boolean(),
    logo:           z.any().optional(),
    
    // Personnalisation
    documentTemplate: z.string().min(1, "Modèle requis"),
    primaryColor:     z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Format couleur invalide"),
    secondaryColor:   z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Format couleur invalide"),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
