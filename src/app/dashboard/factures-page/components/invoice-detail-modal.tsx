import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Invoice, InvoiceStatus } from "@/lib/configs/interface/invoice";
import { Printer, X, CheckCircle2, Ban, Download, Mail } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { DocumentRenderer } from "@/components/documents/templates/DocumentRenderer";
import { DocumentData, CompanySettings } from "@/components/documents/templates/types";
import { useDocumentSettings } from "@/hooks/use-document-settings";
import api from "@/api/api.config";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { generatePDFFromHTML, getPDFBlobFromHTML } from "@/lib/utils/pdf-generator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function InvoiceDetailModal({ invoice, isOpen, onClose, onUpdate }: InvoiceDetailModalProps) {
  const { settings, refreshUserData } = useDocumentSettings();
  const toast = useAppToast();
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Recharger les données utilisateur fraîches quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      refreshUserData().catch(() => {
      });
    }
  }, [isOpen]); // Retirer refreshUserData des dépendances pour éviter les boucles

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
    if (!invoice) return null;
    return {
      type: 'INVOICE',
      number: invoice.invoiceNumber,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      client: {
        name: `${invoice.client.firstName} ${invoice.client.lastName}`,
        company: invoice.client.companyName,
        address: invoice.client.address,
        email: invoice.client.email,
        phone: invoice.client.phone
      },
      items: invoice.lines,
      totalHt: invoice.totalHt,
      totalTva: invoice.totalTva,
      totalTtc: invoice.totalTtc,
      notes: [
        invoice.quoteNumber ? `Issu du devis n° ${invoice.quoteNumber}` : undefined,
        invoice.paymentMethod ? `Mode de règlement : ${invoice.paymentMethod}` : undefined,
      ].filter(Boolean).join('\n') || undefined
    };
  }, [invoice]);

  if (!invoice || !documentData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const element = document.getElementById('invoice-document');
      if (!element) {
        toast.error("Erreur", "Impossible de générer le PDF");
        return;
      }
      await generatePDFFromHTML(
        element,
        `Facture_${invoice.invoiceNumber}.pdf`,
        { orientation: 'portrait', format: 'a4' }
      );
      toast.success("Succès", "Facture téléchargée en PDF");
    } catch {
      toast.error("Erreur", "Impossible de télécharger le PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const element = document.getElementById('invoice-document');
      if (!element) {
        toast.error("Erreur", "Impossible de générer le PDF pour l'envoi");
        return;
      }

      const pdfBlob = await getPDFBlobFromHTML(element, { orientation: 'portrait', format: 'a4' });
      const formData = new FormData();
      formData.append('file', pdfBlob, `Facture_${invoice.invoiceNumber}.pdf`);
      formData.append('to', invoice.client.email);
      formData.append('subject', `Facture ${invoice.invoiceNumber}`);
      formData.append('clientName', `${invoice.client.firstName} ${invoice.client.lastName}`);
      formData.append('documentNumber', invoice.invoiceNumber);
      formData.append('documentType', 'FACTURE');

      await api.post('/email/send-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Succès", "Facture envoyée par email au client");
    } catch {
      toast.error("Erreur", "Impossible d'envoyer l'email");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: InvoiceStatus) => {
    setLoading(true);
    try {
      await api.patch(`/invoices/${invoice.id}/status`, { status: newStatus });
      toast.success("Succès", `Statut mis à jour : ${newStatus}`);
      onUpdate?.();
    } catch {
      toast.error("Erreur", "Impossible de mettre à jour le statut");
    } finally {
      setLoading(false);
    }
  };

  const registerPayment = async () => {
    setLoading(true);
    try {
      await api.patch(`/invoices/${invoice.id}/status`, { status: 'PAYEE' });
      toast.success("Succès", "Facture marquée comme payée");
      onUpdate?.();
    } catch {
      toast.error("Erreur", "Impossible d'enregistrer le paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[98vw] max-h-[95vh] overflow-y-auto p-0 flex flex-col rounded-2xl gap-0 dark:bg-zinc-950 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Header */}
        <div className="flex flex-col border-b dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-950 z-50 print:hidden">
          <div className="flex justify-between items-center p-4 gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold truncate">FACTURE {invoice.invoiceNumber}</DialogTitle>
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
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">Statut</span>
              <Select
                value={invoice.status}
                onValueChange={(v) => updateStatus(v as InvoiceStatus)}
                disabled={loading}
              >
                <SelectTrigger className="w-40 h-8 rounded-full text-sm dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-zinc-800 dark:border-zinc-700">
                  <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                  <SelectItem value="PAYEE">Payée</SelectItem>
                  <SelectItem value="EN_RETARD">En retard</SelectItem>
                  <SelectItem value="ANNULEE">Annulée</SelectItem>
                  <SelectItem value="AVOIR">Avoir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden sm:block h-4 w-px bg-slate-300 dark:bg-zinc-700" />

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">Actions</span>
              {invoice.status !== 'PAYEE' && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white gap-2 rounded-full text-xs font-semibold"
                  onClick={registerPayment}
                  disabled={loading}
                >
                  <CheckCircle2 className="size-3.5" /> Marquer payée
                </Button>
              )}

              {invoice.status === 'EN_ATTENTE' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 gap-2 rounded-full text-xs font-semibold"
                  onClick={() => updateStatus('ANNULEE')}
                  disabled={loading}
                >
                  <Ban className="size-3.5" /> Annuler
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Document Content - Now scrollable with overflow-y-auto at container level */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-100 to-slate-50 dark:bg-zinc-700 p-3 md:p-6 flex items-center justify-center print:bg-white print:p-0">
          <div id="invoice-document" className="bg-white dark:bg-zinc-900 shadow-xl w-full max-w-2xl print:shadow-none print:max-w-none print:bg-white rounded-xl print:rounded-none border dark:border-zinc-800 print:border-none">
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
            #invoice-document {
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
