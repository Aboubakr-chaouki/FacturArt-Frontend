export const STATUS_JURIDIQUE = [
    "Auto-entrepreneur",
    "Entreprise Individuelle (EI)",
    "EURL",
    "SARL",
    "SAS",
    "SASU",
    "SA",
    "Autre",
] as const

export type FormeJuridique = typeof STATUS_JURIDIQUE[number]
