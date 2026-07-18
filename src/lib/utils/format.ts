import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

export const formatDateTime = (dateStr: string | Date | null | undefined): string => {
    try {
      if (!dateStr) return "N/A";
      const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      if (isNaN(date.getTime())) return "Date invalide";
      return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch {
      return "Erreur date";
    }
  };
