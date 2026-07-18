import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/api.config";
import { AxiosError } from "axios";
import { PublicQuoteResponse, DocumentLine } from "@/lib/configs/interface";
import { DocumentRenderer } from "@/components/documents/templates/DocumentRenderer";
import { DocumentData, CompanySettings } from "@/components/documents/templates/types";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader2, Printer } from "lucide-react";
import { toast } from "sonner";
import { useFetch } from "@/hooks/common/use-fetch";
import { DEFAULT_COLORS } from "@/lib/configs/document-themes";

interface InvoiceData {
  invoiceNumber: string;
  id: number;
}

export default function PublicQuoteView() {
  const { token } = useParams<{ token: string }>();
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validatedInvoice, setValidatedInvoice] = useState<InvoiceData | null>(null);

  const fetchQuote = useCallback(() => api.get<PublicQuoteResponse>(`/public/quotes/${token}`).then(r => r.data), [token]);

  const {
    data: quote,
    isLoading: loading,
    error,
  } = useFetch<PublicQuoteResponse>(fetchQuote, {
    immediate: !!token,
    errorMessage: "Impossible de charger le devis."
  });

  // Gérer le cas où le devis est déjà converti au chargement
  useEffect(() => {
    if (quote && (quote.status === 'CONVERTI' || quote.status === 'ACCEPTE' || quote.invoiceNumber)) {
      setValidatedInvoice({
        invoiceNumber: quote.invoiceNumber || '',
        id: quote.invoiceId || 0
      });
      setIsSuccess(true);
    }
  }, [quote]);

  const handleValidate = useCallback(async () => {
    console.log("[DEBUG] handleValidate called");
    console.log("[DEBUG] { token, isValidating, quote }", { token, isValidating, quote: !!quote });
    
    if (isValidating || !token || !quote) {
      console.log("[DEBUG] Early return - validation already in progress or missing data");
      return;
    }
    
    console.log("[DEBUG] Quote status:", quote.status);

    console.log("[DEBUG] Sending validation request to:", `/public/quotes/${token}/validate`);
    setIsValidating(true);
    const toastId = toast.loading("Validation en cours...");
    
    try {
      const response = await api.post(`/public/quotes/${token}/validate`, {});
      console.log("[DEBUG] Validation successful:", response.data);
      setValidatedInvoice(response.data);
      setIsSuccess(true);
      toast.success("Devis validé", {
        id: toastId,
        description: "Votre devis a été accepté avec succès. Une facture a été générée."
      });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error("[DEBUG] Validation failed:", axiosError);
      const errorMessage = axiosError.response?.data?.message || "Une erreur est survenue lors de la validation.";
      toast.error("Erreur de validation", {
        id: toastId,
        description: errorMessage
      });
    } finally {
      setIsValidating(false);
    }
  }, [token, quote, isValidating]);

  // Supprimé: l'auto-validation n'est plus souhaitée pour forcer la saisie manuelle de la phrase de confirmation

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="size-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Chargement de votre devis...</p>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center">
          <AlertCircle className="size-16 text-destructive mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Lien invalide</h1>
          <p className="text-slate-500 mb-8">
            {error || "Ce devis n'est plus disponible ou le lien est expiré."}
          </p>
          <Button onClick={() => window.location.href = "/"} className="w-full">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

   if (isSuccess) {
     return (
       <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
         <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center">
           <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="size-12 text-green-600" />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 mb-2">Devis validé !</h1>
           <p className="text-slate-500 mb-6">
             Merci d'avoir validé le devis <strong>{quote?.quoteNumber}</strong>. 
             L'artisan a été notifié et votre facture est disponible.
           </p>
           
           {validatedInvoice && (
             <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8 text-left">
               <div className="text-sm text-slate-500 mb-1">Nouvelle facture générée :</div>
               <div className="text-lg font-bold text-slate-900 mb-4">{validatedInvoice.invoiceNumber}</div>
               <div className="flex flex-col gap-3">
                 <Button 
                   className="w-full justify-start gap-2 h-11" 
                   onClick={() => window.print()}
                   variant="outline"
                 >
                   <Printer className="size-4" /> Imprimer la facture
                 </Button>
                 <div className="text-[11px] text-slate-400 text-center italic">
                   Une copie vous a également été envoyée par email.
                 </div>
               </div>
             </div>
           )}

           <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-green-800 text-sm">
             FacturArt — Votre allié pour une gestion simplifiée.
           </div>
         </div>
       </div>
     );
   }

   const documentData: DocumentData = {
     type: 'QUOTE',
     number: quote!.quoteNumber,
     issueDate: quote!.issueDate,
     validityDate: quote!.validityDate,
     status: quote!.status,
     client: {
       name: `${quote!.client.firstName} ${quote!.client.lastName}`,
       company: quote!.client.companyName,
       address: `${quote!.client.addressLine1 || ''}\n${quote!.client.postalCode || ''} ${quote!.client.city || ''}`.trim(),
       email: quote!.client.email
     },
     items: quote!.lines.map((l: DocumentLine) => ({
       description: l.description,
       quantity: l.quantity,
       unitPrice: l.unitPrice,
       totalHt: l.totalHt,
       tvaRate: l.tvaRate,
       unit: l.unit
     })),
     totalHt: quote!.totalHt,
     totalTva: quote!.totalTva,
     totalTtc: quote!.totalTtc,
     notes: quote!.notes
   };

   const documentSettings: CompanySettings = {
     companyName: quote!.artisan.nomCommercial || `${quote!.artisan.firstName} ${quote!.artisan.lastName}`,
     companyAddress: quote!.artisan.adresseSiege || '',
     companyEmail: quote!.artisan.emailPro || quote!.artisan.email,
     companyPhone: quote!.artisan.telephonePro,
     logoUrl: quote!.artisan.logo,
     primaryColor: quote!.artisan.primaryColor || DEFAULT_COLORS.primary,
     secondaryColor: quote!.artisan.secondaryColor || DEFAULT_COLORS.secondary,
     template: quote!.artisan.documentTemplate?.toLowerCase() || 'modern',
     siret: quote!.artisan.siret,
     tvaIntra: quote!.artisan.numeroTva,
     rcs: quote!.artisan.rcs,
     capital: quote!.artisan.capital,
     legalForm: quote!.artisan.formeJuridique
    };

    const isQuoteAlreadyConverted = quote && (quote.status === 'CONVERTI' || quote.status === 'ACCEPTE');
    const canValidate = !isValidating && !isQuoteAlreadyConverted;

    return (
     <div className="min-h-screen bg-slate-100 pb-20">
       <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
         <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <span className="font-bold text-xl tracking-tight">Factur<span className="text-primary">Art</span></span>
           </div>
           <div className="flex items-center gap-4">
             <span className="text-sm text-slate-500 hidden sm:inline">Référence : {quote?.quoteNumber}</span>
              <Button 
                onClick={handleValidate} 
                disabled={!canValidate}
                className="shadow-lg font-bold transition-all active:scale-95 px-6"
                style={{ 
                  backgroundColor: canValidate ? documentSettings.secondaryColor : '#cbd5e1',
                  color: canValidate ? documentSettings.primaryColor : '#64748b',
                  borderColor: canValidate ? documentSettings.secondaryColor : '#cbd5e1'
                }}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Validation...
                  </>
                ) : isQuoteAlreadyConverted ? (
                  <>
                    <CheckCircle className="mr-2 size-4" />
                    Devis déjà accepté
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 size-4" />
                    Accepter et Facturer
                  </>
                )}
              </Button>
           </div>
         </div>
       </div>

       <div className="max-w-5xl mx-auto px-4 mt-8">
         <div className="bg-white shadow-2xl rounded-sm overflow-hidden min-h-[297mm]">
           <DocumentRenderer data={documentData} settings={documentSettings} />
         </div>
       </div>
      
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 sm:hidden">
           <Button 
             onClick={handleValidate} 
             disabled={!canValidate}
             className="w-full h-12 text-lg font-bold shadow-2xl"
             style={{ 
               backgroundColor: canValidate ? documentSettings.secondaryColor : '#cbd5e1',
               color: canValidate ? documentSettings.primaryColor : '#64748b'
             }}
           >
             {isValidating ? (
               <>
                 <Loader2 className="mr-2 size-4 animate-spin" />
                 Validation...
               </>
             ) : isQuoteAlreadyConverted ? (
               <>
                 <CheckCircle className="mr-2 size-4" />
                 Déjà accepté
               </>
             ) : (
               "Accepter et Facturer"
             )}
           </Button>
        </div>
     </div>
   );
 }
