import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BASE_URL } from "@/api/api.config";

export const getLogoUrl = (url?: string) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  return `${BASE_URL}${url}`;
};

export const fetchImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      cache: 'no-cache'
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // Si c'est une image locale ou qu'elle est déjà en base64, on la retourne telle quelle
    if (url.startsWith('/') || url.startsWith('data:')) return url;
    return url;
  }
};

export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: fr });
  } catch {
    return "Date invalide";
  }
};

