import { useState, useCallback, useMemo } from "react";
import { quotesApi } from "@/api/quotes/quotes.api";
import { Quote } from "@/lib/configs/interface";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { useFetch } from "@/hooks/common/use-fetch";

export function useQuotes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useAppToast();

  const fetchFn = useMemo(() => () => quotesApi.getAll(), []);

  const { 
    data: quotes = [], 
    isLoading, 
    execute: fetchQuotes,
    setData: setQuotes
  } = useFetch<Quote[]>(fetchFn, {
    errorMessage: "Impossible de charger les devis."
  });

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
      if (setQuotes) setQuotes(quotes.filter(q => q.id !== quoteToDelete.id));
      toast.success("Succès", "Le devis a été supprimé");
      setIsDeleteModalOpen(false);
      setQuoteToDelete(null);
    } catch {
      toast.error("Erreur", "Impossible de supprimer le devis");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    if (!quote || !quote.client) return false;
    const search = searchTerm.toLowerCase();
    return (quote.quoteNumber || "").toLowerCase().includes(search) || 
           (quote.client.companyName || "").toLowerCase().includes(search) || 
           `${quote.client.firstName} ${quote.client.lastName}`.toLowerCase().includes(search);
  });

  return {
    quotes,
    filteredQuotes,
    isLoading,
    searchTerm,
    setSearchTerm,
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
