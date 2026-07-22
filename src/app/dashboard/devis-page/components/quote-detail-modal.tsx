import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote } from "@/lib/configs/interface/quote";
import { Printer, X, Check, FileText, Download, Mail, Clock } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { DocumentRenderer } from "@/components/documents/templates/DocumentRenderer";
import { DocumentData, CompanySettings } from "@/components/documents/templates/types";
import { useDocumentSettings } from "@/hooks/use-document-settings";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { generatePDFFromHTML, getPDFBlobFromHTML } from "@/lib/utils/pdf-generator";
import api from "@/api/api.config";

interface QuoteDetailModalProps {
  quote: Quote | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  onConvert?: (quoteId: string) => void;
  }
  
  export function QuoteDetailModal({ quote, isOpen, onClose, onUpdate }: QuoteDetailModalProps) {
    const { settings, refreshUserData } = useDocumentSettings();
    const toast = useAppToast();
    const [downloading, setDownloading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
  
    // Recharger les données utilisateur fraîches quand la modale s'ouvre
    useEffect(() => {
      if (isOpen) {
        refreshUserData().catch(() => {
        });
      }
    }, [isOpen]); 
  
    const company: CompanySettings = useMemo(() => ({
    companyName: settings.companyName || "VOTRE ENTREPRISE",
    companyAddress: settings.companyAddress,
    companyPhone: settings.companyPhone,
    companyEmail: settings.companyEmail,
    companyWebsite: settings.companyWebsite,
    siret: settings.siret,
    tvaIntra: settings.tvaIntra,
    legalForm: settings.legalForm,
    capital: settings.capital,
    rcs: settings.rcs,
    logoUrl: settings.logoUrl,
    footerText: settings.footerText,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    template: settings.template
  }), [settings]);

  const documentData: DocumentData | null = useMemo(() => {
    if (!quote) return null;
    return {
      type: 'QUOTE',
      number: quote.quoteNumber,
      issueDate: quote.issueDate,
      validityDate: quote.validityDate,
      status: quote.status as 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE' | 'CONVERTI',
      client: {
        name: `${quote.client.firstName} ${quote.client.lastName}`,
        company: quote.client.companyName,
        address: quote.client.address,
        email: quote.client.email,
        phone: quote.client.phone
      },
      items: quote.lines,
      totalHt: quote.totalHt,
      totalTva: quote.totalTva,
      totalTtc: quote.totalTtc,
      notes: quote.notes
    };
  }, [quote]);

  if (!quote || !documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('quote-document');
      if (!element) {
        toast.error("Erreur", "Impossible de générer le PDF");
        return;
      }
      await generatePDFFromHTML(
        element,
        `Devis_${quote.quoteNumber}.pdf`,
        { orientation: 'portrait', format: 'a4' }
      );
      toast.success("Succès", "Devis téléchargé en PDF");
    } catch {
      toast.error("Erreur", "Impossible de télécharger le PDF");
    } finally {
      setDownloading(false);
    }
  };


    const handleSendEmail = async () => {
      setLoading(true);
      try {
        const element = document.getElementById('quote-document');
        if (!element) {
          toast.error("Erreur", "Impossible de générer le PDF pour l'envoi");
          return;
        }
  
        const pdfBlob = await getPDFBlobFromHTML(element, { orientation: 'portrait', format: 'a4' });
        const formData = new FormData();
        formData.append('file', pdfBlob, `Devis_${quote.quoteNumber}.pdf`);
        formData.append('to', quote.client.email);
        formData.append('subject', `Devis ${quote.quoteNumber}`);
        formData.append('clientName', `${quote.client.firstName} ${quote.client.lastName}`);
        formData.append('documentNumber', quote.quoteNumber);
        formData.append('documentType', 'DEVIS');
  
        if (quote.validationToken) {
          const validationUrl = `${window.location.origin}/public/quotes/${quote.validationToken}`;
          formData.append('validationUrl', validationUrl);
        }
  
        await api.post('/email/send-pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        toast.success("Succès", "Devis envoyé par email au client");
      } catch {
        toast.error("Erreur", "Impossible d'envoyer l'email");
      } finally {
        setLoading(false);
      }
    };

    const handleConvertToInvoice = async () => {
      setIsConverting(true);
      try {
        await api.post(`/invoices/from-quote/${quote.id}`);
        toast.success("Succès", "Devis converti en facture avec succès");
        if (onUpdate) onUpdate();
        onClose();
      } catch {
        toast.error("Erreur", "Impossible de convertir le devis en facture");
      } finally {
        setIsConverting(false);
      }
    };
  
    return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[98vw] max-h-[95vh] overflow-y-auto p-0 flex flex-col rounded-2xl gap-0 dark:bg-zinc-950 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Header */}
        <div className="flex flex-col border-b dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-950 z-50 print:hidden">
          <div className="flex justify-between items-center p-4 gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold truncate">DEVIS {quote.quoteNumber}</DialogTitle>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full whitespace-nowrap"
                onClick={handleSendEmail}
                disabled={loading}
              >
                <Mail className="size-4" /> {loading ? "Envoi..." : "Envoyer par email"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full whitespace-nowrap"
                onClick={handleDownloadPDF}
                disabled={downloading}
              >
                <Download className="size-4" /> {downloading ? "Téléchargement..." : "PDF"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full whitespace-nowrap"
                onClick={handlePrint}
              >
                <Printer className="size-4" /> Imprimer
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9"
                onClick={onClose}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-zinc-900 border-t dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">Statut actuel</span>
              <Badge variant="outline" className="rounded-full px-3 py-1 font-medium bg-white dark:bg-zinc-800">
                {quote.status === 'ENVOYE' ? 'Envoyé au client' : 
                 quote.status === 'ACCEPTE' ? 'Accepté' : 
                 quote.status === 'CONVERTI' ? 'Converti en facture' : 
                 quote.status === 'REFUSE' ? 'Refusé' : quote.status}
              </Badge>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-zinc-700 mx-2" />

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">Actions</span>
              {quote.status === 'CONVERTI' ? (
                <div className="flex flex-col">
                  <Badge variant="outline" className="gap-2 py-1.5 px-3 rounded-full text-xs font-semibold border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                    <FileText className="size-3.5" /> Devis déjà facturé
                  </Badge>
                  {quote.invoiceNumber && (
                    <span className="text-[10px] text-muted-foreground italic px-3 mt-1 font-medium">
                      Lié à la facture n° {quote.invoiceNumber}
                    </span>
                  )}
                </div>
              ) : quote.status === 'ACCEPTE' ? (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 rounded-full py-1.5 px-3">
                    <Check className="size-4 mr-1" /> Validé par le client
                  </Badge>
                  <Button
                    size="sm"
                    className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-8 px-4 font-bold"
                    onClick={handleConvertToInvoice}
                    disabled={isConverting}
                  >
                    {isConverting ? "Conversion..." : "Générer la facture"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500 rounded-full py-1.5 px-3">
                    <Clock className="size-4 mr-1" /> En attente de validation client
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Content - Now scrollable with overflow-y-auto at container level */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-100 to-slate-50 dark:from-zinc-900 dark:to-zinc-950 p-3 md:p-6 flex items-center justify-center print:bg-white print:p-0">
          <div id="quote-document" className="bg-white dark:bg-zinc-900 shadow-xl w-full max-w-2xl print:shadow-none print:max-w-none print:bg-white rounded-xl print:rounded-none border dark:border-zinc-800 print:border-none">
            <DocumentRenderer data={documentData} settings={company} />
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              background-color: white !important;
            }
            #quote-document {
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
              width: 210mm !important;
              min-height: 297mm !important;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

