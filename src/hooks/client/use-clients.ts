import { useCallback } from "react";
import { toast } from "sonner";
import { Client } from "@/lib/configs/interface/client.ts";
import { clientsApi } from "@/api/clients/clients.api";
import { useFetch } from "@/hooks/common/use-fetch";

export const useClients = () => {
  const fetchFn = useCallback(() => clientsApi.getAll(), []);
  
  const { 
    data: clients = [], 
    isLoading, 
    error, 
    execute: fetchClients 
  } = useFetch<Client[]>(fetchFn, {
    errorMessage: "Erreur lors du chargement des clients"
  });

  const deleteClient = async (id: number) => {
    await clientsApi.delete(id);
    toast.success("Client supprimé avec succès");
    await fetchClients();
  };

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    deleteClient,
  };
};
