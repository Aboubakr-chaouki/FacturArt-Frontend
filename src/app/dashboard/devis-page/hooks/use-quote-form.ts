import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createQuoteSchema, CreateQuoteFormData } from "@/lib/configs/schemas-zod/form/quote.schema";
import { quotesApi } from "@/api/quotes/quotes.api";
import { Quote } from "@/lib/configs/interface/quote";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { format } from "date-fns";

interface UseQuoteFormProps {
  onSuccess?: (quote: Quote) => void;
}

export const useQuoteForm = ({ onSuccess }: UseQuoteFormProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useAppToast();

  const form = useForm<CreateQuoteFormData>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: {
      clientId: undefined,
      issueDate: format(new Date(), "yyyy-MM-dd"),
      validityDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      notes: "",
      lines: [{ description: "", quantity: 1, unitPrice: 0, tvaRate: 20 }],
    },
  });

  const onSubmit = async (data: CreateQuoteFormData) => {
    setIsLoading(true);
    try {
      const quote = await quotesApi.create(data);
      toast.success("Succès", "Le devis a été créé avec succès.");
      form.reset();
      onSuccess?.(quote);
    } catch (error: unknown) {
      let errorMessage = "Une erreur est survenue lors de la création du devis.";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
