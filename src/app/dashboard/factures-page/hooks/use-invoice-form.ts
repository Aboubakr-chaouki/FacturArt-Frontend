import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceSchema, CreateInvoiceFormData } from "@/lib/configs/schemas-zod/form/invoice.schema";
import { invoicesApi } from "@/api/invoices/invoices.api";
import { Invoice } from "@/lib/configs/interface/invoice";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { format } from "date-fns";
import { AxiosError } from "axios";

interface UseInvoiceFormProps {
  onSuccess?: (invoice: Invoice) => void;
}

export const useInvoiceForm = ({ onSuccess }: UseInvoiceFormProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useAppToast();

  const form = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      clientId: undefined,
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      status: "EN_ATTENTE",
      paymentMethod: "",
      lines: [{ description: "", quantity: 1, unitPrice: 0, tvaRate: 20 }],
    },
  });

  const onSubmit = async (data: CreateInvoiceFormData) => {
    setIsLoading(true);
    try {
      const invoice = await invoicesApi.create(data);
      toast.success("Succès", "La facture a été créée avec succès.");
      form.reset();
      onSuccess?.(invoice);
    } catch (error) {
      const axiosError = error as AxiosError<{message: string}>;
      const errorMessage = axiosError.response?.data?.message || "Une erreur est survenue lors de la création de la facture.";
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
