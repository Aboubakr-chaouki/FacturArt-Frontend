import { useState, useCallback, useMemo } from "react";
import { invoicesApi } from "@/api/invoices/invoices.api";
import { Invoice } from "@/lib/configs/interface";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { useFetch } from "@/hooks/common/use-fetch";

export function useInvoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useAppToast();

  const fetchFn = useMemo(() => () => invoicesApi.getAll(), []);

  const { 
    data: invoices = [], 
    isLoading, 
    execute: fetchInvoices,
    setData: setInvoices
  } = useFetch<Invoice[]>(fetchFn, {
    errorMessage: "Impossible de charger les factures."
  });

  const handleInvoiceUpdate = useCallback(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    try {
      setIsDeleting(true);
      await invoicesApi.delete(invoiceToDelete.id);
      if (setInvoices) setInvoices(invoices.filter(inv => inv.id !== invoiceToDelete.id));
      toast.success("Succès", "La facture a été supprimée");
      setIsDeleteModalOpen(false);
      setInvoiceToDelete(null);
    } catch {
      toast.error("Erreur", "Impossible de supprimer la facture");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (!invoice || !invoice.client) return false;
    const search = searchTerm.toLowerCase();
    return (invoice.invoiceNumber || "").toLowerCase().includes(search) || 
           (invoice.client.companyName || "").toLowerCase().includes(search) || 
           `${invoice.client.firstName} ${invoice.client.lastName}`.toLowerCase().includes(search);
  });

  return {
    invoices,
    filteredInvoices,
    isLoading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    selectedInvoice,
    setSelectedInvoice,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    invoiceToDelete,
    setInvoiceToDelete,
    isDeleting,
    handleInvoiceUpdate,
    handleViewDetails,
    handleDeleteInvoice,
    fetchInvoices
  };
}
