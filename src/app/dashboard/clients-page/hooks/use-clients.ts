import { useState, useEffect, useMemo } from "react";
import { clientsApi } from "@/api/clients/clients.api";
import { Client } from "@/lib/configs/interface/client.ts";
import { useAppToast } from "@/hooks/common/use-app-toast";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "particulier" | "professionnel">("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useAppToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await clientsApi.getAll();
      setClients(data);
    } catch {
      toast.error("Erreur lors du chargement des clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    let result = clients;
    if (filterType === "particulier") result = result.filter(c => !c.companyName);
    else if (filterType === "professionnel") result = result.filter(c => !!c.companyName);

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.lastName.toLowerCase().includes(s) || 
        c.firstName.toLowerCase().includes(s) || 
        c.email.toLowerCase().includes(s) ||
        (c.companyName && c.companyName.toLowerCase().includes(s))
      );
    }
    return result;
  }, [clients, searchTerm, filterType]);

  const handleDelete = async () => {
    if (!selectedClient) return;
    try {
      setIsDeleting(true);
      await clientsApi.delete(selectedClient.id);
      toast.success("Client supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
      fetchClients();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    clients,
    filteredClients,
    isLoading,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    isDeleting,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedClient,
    setSelectedClient,
    handleDelete,
    fetchClients
  };
}
