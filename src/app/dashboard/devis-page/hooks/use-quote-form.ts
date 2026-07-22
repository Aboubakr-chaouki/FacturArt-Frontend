import { useMemo } from "react";
import { useDocumentForm } from "@/hooks/common/use-document-form";
import { createQuoteSchema, CreateQuoteFormData } from "@/lib/configs/schemas-zod/form/quote.schema";
import { quotesApi } from "@/api/quotes/quotes.api";
import { Quote } from "@/lib/configs/interface/quote";
import { format } from "date-fns";

interface UseQuoteFormProps {
  onSuccess?: (quote: Quote) => void;
}

export const useQuoteForm = ({ onSuccess }: UseQuoteFormProps = {}) => {
  const defaultValues = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    return {
      clientId: undefined as unknown as number,
      issueDate: format(new Date(), "yyyy-MM-dd"),
      validityDate: format(new Date(now + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      notes: "",
      lines: [{ description: "", quantity: 1, unitPrice: 0, tvaRate: 20 }],
    };
  }, []);

  return useDocumentForm<CreateQuoteFormData, Quote>({
    schema: createQuoteSchema,
    defaultValues,
    onSubmitAction: (data) => quotesApi.create(data),
    successMessage: "Le devis a été créé avec succès.",
    onSuccess,
  });
};
