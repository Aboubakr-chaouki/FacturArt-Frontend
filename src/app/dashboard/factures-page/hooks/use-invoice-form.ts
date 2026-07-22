import { useMemo } from "react";
import { useDocumentForm } from "@/hooks/common/use-document-form";
import { createInvoiceSchema, CreateInvoiceFormData } from "@/lib/configs/schemas-zod/form/invoice.schema";
import { invoicesApi } from "@/api/invoices/invoices.api";
import { Invoice } from "@/lib/configs/interface/invoice";
import { format } from "date-fns";

interface UseInvoiceFormProps {
  onSuccess?: (invoice: Invoice) => void;
}

export const useInvoiceForm = ({ onSuccess }: UseInvoiceFormProps = {}) => {
  const defaultValues = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    return {
      clientId: undefined as unknown as number,
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(new Date(now + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      status: "EN_ATTENTE" as const,
      paymentMethod: "",
      lines: [{ description: "", quantity: 1, unitPrice: 0, tvaRate: 20 }],
    };
  }, []);

  return useDocumentForm<CreateInvoiceFormData, Invoice>({
    schema: createInvoiceSchema,
    defaultValues,
    onSubmitAction: (data) => invoicesApi.create(data),
    successMessage: "La facture a été créée avec succès.",
    onSuccess,
  });
};
