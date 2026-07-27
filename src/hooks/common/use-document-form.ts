import { useState, useEffect } from "react";
import { useForm, DefaultValues, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { clientsApi } from "@/api/clients/clients.api";
import { Client } from "@/lib/configs/interface/client";
import { ZodSchema } from "zod";

interface UseDocumentFormProps<TFieldValues extends FieldValues, TResponse> {
  schema: ZodSchema<TFieldValues>;
  defaultValues: DefaultValues<TFieldValues>;
  onSubmitAction: (data: TFieldValues) => Promise<TResponse>;
  successMessage: string;
  onSuccess?: (response: TResponse) => void;
}

export const useDocumentForm = <TFieldValues extends FieldValues, TResponse>({
  schema,
  defaultValues,
  onSubmitAction,
  successMessage,
  onSuccess,
}: UseDocumentFormProps<TFieldValues, TResponse>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const toast = useAppToast();

  const form = useForm<TFieldValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientsApi.getAll();
        setClients(data);
      } catch {
        // Silently fail or handle error
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (data: TFieldValues) => {
    setIsLoading(true);
    try {
      const response = await onSubmitAction(data);
      toast.success("Succès", successMessage);
      form.reset();
      onSuccess?.(response);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (error as any).response?.data?.message || "Une erreur est survenue.";
      toast.error("Erreur", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    clients,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: form.handleSubmit(handleSubmit as any),
  };
};
