import { useState, useCallback, useEffect } from "react";
import { invoicesApi } from "@/api/invoices/invoices.api";
import { Invoice, PageResponse } from "@/lib/configs/interface";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { useFetch } from "@/hooks/common/use-fetch";

export function useInvoices() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useAppToast();

  const fetchFn = useCallback(() => invoicesApi.getAllPaginated({
    page,
    size: pageSize,
    search: searchTerm,
    status: status
  }), [page, pageSize, searchTerm, status]);

  const { 
    data: pageData, 
    isLoading, 
    execute: fetchInvoices,
  } = useFetch<PageResponse<Invoice>>(fetchFn, {
    errorMessage: "Impossible de charger les factures."
  });

  const invoices = pageData?.content || [];
  const totalElements = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

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
      fetchInvoices();
      toast.success("Succès", "La facture a été supprimée");
      setIsDeleteModalOpen(false);
      setInvoiceToDelete(null);
    } catch {
      toast.error("Erreur", "Impossible de supprimer la facture");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    invoices,
    totalElements,
    totalPages,
    page,
    setPage,
    pageSize,
    setPageSize,
    isLoading,
    searchTerm,
    setSearchTerm,
    status,
    setStatus,
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
