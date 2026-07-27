import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, FileText, Send } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  type: 'invoice' | 'quote';
}

export const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  if (type === 'invoice') {
    switch (status) {
      case 'PAYEE':
        return <Badge className="bg-green-500 hover:bg-green-600 rounded-full"><CheckCircle className="size-3 mr-1" /> Payée</Badge>;
      case 'EN_ATTENTE':
        return <Badge className="bg-orange-500 hover:bg-orange-600 rounded-full"><Clock className="size-3 mr-1" /> En attente</Badge>;
      case 'EN_RETARD':
        return <Badge variant="destructive" className="rounded-full"><XCircle className="size-3 mr-1" /> En retard</Badge>;
      case 'ANNULEE':
        return <Badge variant="outline" className="rounded-full">Annulée</Badge>;
      default:
        return <Badge variant="secondary" className="rounded-full">{status}</Badge>;
    }
  } else {
    switch (status) {
      case 'BROUILLON':
        return <Badge variant="outline" className="rounded-full"><FileText className="size-3 mr-1" /> Brouillon</Badge>;
      case 'ENVOYE':
        return <Badge className="bg-blue-500 hover:bg-blue-600 rounded-full"><Send className="size-3 mr-1" /> Envoyé</Badge>;
      case 'ACCEPTE':
      case 'CONVERTI':
        return <Badge className="bg-green-500 hover:bg-green-600 rounded-full"><CheckCircle className="size-3 mr-1" /> {status === 'CONVERTI' ? 'Facturé' : 'Accepté'}</Badge>;
      case 'REFUSE':
        return <Badge variant="destructive" className="rounded-full"><XCircle className="size-3 mr-1" /> Refusé</Badge>;
      default:
        return <Badge variant="secondary" className="rounded-full">{status}</Badge>;
    }
  }
};
