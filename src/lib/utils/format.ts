import { format } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formate une date au format français (dd/MM/yyyy).
 * @param dateStr La date à formater (chaîne, objet Date, null ou undefined).
 * @returns La date formatée ou "N/A"/"Date invalide" en cas d'erreur.
 */
export const formatDate = (dateStr: string | Date | null | undefined): string => {
  try {
    if (!dateStr) return "N/A";
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(date.getTime())) return "Date invalide";
    return format(date, 'dd/MM/yyyy', { locale: fr });
  } catch {
    return "Erreur date";
  }
};

export const formatCurrency = (amount: number | string | null | undefined): string => {
  try {
    if (amount === null || amount === undefined) return "0,00 €";
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(value)) return "0,00 €";
    return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  } catch {
    return "0,00 €";
  }
};

