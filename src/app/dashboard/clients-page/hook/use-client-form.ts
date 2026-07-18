import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  createClientSchema,
  updateClientSchema,
  CreateClientFormData,
  UpdateClientFormData,
} from "@/lib/configs/schemas-zod/form/client.schema";
import {Client} from "@/lib/configs/interface/client.ts";
import { clientsApi } from "@/api/clients/clients.api";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { AxiosError } from "axios";

interface UseClientFormProps {
  mode: "create" | "update";
  clientId?: number;
  onSuccess?: (client: Client) => void;
  onError?: (error: Error) => void;
}

export const useClientForm = ({
  mode,
  clientId,
  onSuccess,
  onError,
}: UseClientFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useAppToast();

  const schema = mode === "create" ? createClientSchema : updateClientSchema;

  const form = useForm<CreateClientFormData | UpdateClientFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      postalCode: "",
      city: "",
      companyName: "",
      notes: "",
    },
  });

  const onSubmit = async (data: CreateClientFormData | UpdateClientFormData) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      let client: Client;
      
      if (mode === "create") {
        client = await clientsApi.create(data as CreateClientFormData);
        toast.success("Client créé avec succès");
      } else {
        if (!clientId) throw new Error("ID client manquant");
        client = await clientsApi.update(clientId, data as UpdateClientFormData);
        toast.success("Client mis à jour avec succès");
      }

      form.reset();
      onSuccess?.(client);
    } catch (err) {
      let errorMessage = "Une erreur est survenue";
      
      if (err instanceof AxiosError && err.response?.data) {
        const data = err.response.data as { message?: string; error?: string };
        errorMessage = data.message || data.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error("Erreur", errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
