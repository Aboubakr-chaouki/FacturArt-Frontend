import { FormeJuridique } from "../enums/status-juridique.enums"

export interface User {
    id?: string
    firstName: string
    lastName: string
    email: string
    password?: string
    nomCommercial: string
    formeJuridique: FormeJuridique
    siret: string
    adresseSiege: string
    telephonePro: string
    exonerationTva: boolean
    codeApe?: string
    numeroTva?: string
    emailPro?: string
    logo?: string | File
    iban?: string
    rcs?: string
    capital?: string
    emailVerified?: boolean
    documentTemplate?: string
    primaryColor?: string
    secondaryColor?: string
    invoicePrefix?: string
    quotePrefix?: string
}
