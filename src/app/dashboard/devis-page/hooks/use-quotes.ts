import { useState, useCallback, useEffect } from "react";
import { quotesApi } from "@/api/quotes/quotes.api";
import { Quote, PageResponse } from "@/lib/configs/interface";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { useFetch } from "@/hooks/common/use-fetch";

export function useQuotes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useAppToast();

  const fetchFn = useCallback(() => quotesApi.getAllPaginated({
    page,
    size: pageSize,
    search: searchTerm,
    status: status
  }), [page, pageSize, searchTerm, status]);

  const { 
    data: pageData, 
    isLoading, 
    execute: fetchQuotes,
  } = useFetch<PageResponse<Quote>>(fetchFn, {
    errorMessage: "Impossible de charger les devis."
  });

  const quotes = pageData?.content || [];
  const totalElements = pageData?.totalElements || 0;
  const totalPages = pageData?.totalPages || 0;

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleQuoteUpdate = useCallback(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDetailModalOpen(true);
  };

  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return;
    try {
      setIsDeleting(true);
      await quotesApi.delete(quoteToDelete.id);
      fetchQuotes();
      toast.success("Succès", "Le devis a été supprimé");
      setIsDeleteModalOpen(false);
      setQuoteToDelete(null);
    } catch {
      toast.error("Erreur", "Impossible de supprimer le devis");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    quotes,
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
    selectedQuote,
    setSelectedQuote,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    quoteToDelete,
    setQuoteToDelete,
    isDeleting,
    handleQuoteUpdate,
    handleViewDetails,
    handleDeleteQuote,
    fetchQuotes
  };
}
