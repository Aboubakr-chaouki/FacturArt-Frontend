import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Filter,
  Edit,
  Trash2,
  Eye,
  UserCircle,
  Building2,
  Users,
} from "lucide-react";
import { ClientForm } from "./client-form";
import { Client } from "@/lib/configs/interface/client.ts";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/layout/data-table";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { useClients } from "../hooks/use-clients";

export const ClientList = () => {
  const {
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
  } = useClients();

  const columns = [
    {
      header: "Type",
      cell: (client: Client) => client.companyName ? (
        <Badge variant="outline" className="gap-1 border-blue-200 bg-blue-50 text-blue-700 rounded-full">
          <Building2 className="h-3 w-3" /> Pro
        </Badge>
      ) : (
        <Badge variant="outline" className="gap-1 border-orange-200 bg-orange-50 text-orange-700 rounded-full">
          <UserCircle className="h-3 w-3" /> Part
        </Badge>
      )
    },
    {
      header: "Client",
      cell: (client: Client) => (
        <div className="flex flex-col">
          <span className="font-medium">{client.lastName} {client.firstName}</span>
          {client.companyName && <span className="text-xs text-muted-foreground">{client.companyName}</span>}
        </div>
      )
    },
    { header: "Email", accessorKey: "email" },
    { header: "Téléphone", accessorKey: "phone", className: "text-muted-foreground" },
    {
      header: "Actions",
      className: "text-right",
      cell: (client: Client) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsViewDialogOpen(true); }}>
            <Eye className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsEditDialogOpen(true); }}>
            <Edit className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsDeleteDialogOpen(true); }}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des Clients"
        description="Gérez vos clients particuliers et professionnels."
        icon={Users}
        addButtonLabel="Nouveau client"
        onAddClick={() => setIsCreateDialogOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="flex items-center gap-4">
        <Select value={filterType} onValueChange={(v: "all" | "particulier" | "professionnel") => setFilterType(v)}>
          <SelectTrigger className="w-[200px] rounded-full">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les clients</SelectItem>
            <SelectItem value="particulier">Particuliers</SelectItem>
            <SelectItem value="professionnel">Professionnels</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-4 ml-auto">
          <Badge variant="secondary" className="rounded-full px-3 py-1">Total: {clients.length}</Badge>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredClients}
        isLoading={isLoading}
        onRowClick={(client) => { setSelectedClient(client); setIsViewDialogOpen(true); }}
      />

      {/* Dialogs */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau client</DialogTitle>
          </DialogHeader>
          <ClientForm mode="create" onSuccess={() => { fetchClients(); setIsCreateDialogOpen(false); }} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientForm
              mode="update"
              clientId={selectedClient.id}
              initialData={selectedClient}
              onSuccess={() => { fetchClients(); setIsEditDialogOpen(false); }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader><DialogTitle>Détails du client</DialogTitle></DialogHeader>
          {selectedClient && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div><p className="text-xs text-muted-foreground">Nom complet</p><p className="font-medium">{selectedClient.lastName} {selectedClient.firstName}</p></div>
              <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{selectedClient.email}</p></div>
              <div><p className="text-xs text-muted-foreground">Téléphone</p><p className="font-medium">{selectedClient.phone || "N/A"}</p></div>
              <div><p className="text-xs text-muted-foreground">Type</p><Badge variant="secondary" className="rounded-full">{selectedClient.companyName ? "Professionnel" : "Particulier"}</Badge></div>
              {selectedClient.companyName && <div className="col-span-2"><p className="text-xs text-muted-foreground">Entreprise</p><p className="font-medium">{selectedClient.companyName} (SIRET: {selectedClient.siret || "N/A"})</p></div>}
              <div className="col-span-2"><p className="text-xs text-muted-foreground">Adresse</p><p className="font-medium">{selectedClient.addressLine1} {selectedClient.city} {selectedClient.postalCode}</p></div>
              {selectedClient.notes && <div className="col-span-2"><p className="text-xs text-muted-foreground">Notes</p><p className="text-sm">{selectedClient.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmModal
        isOpen={isDeleteDialogOpen}
        title="Supprimer le client"
        description="Voulez-vous vraiment supprimer"
        itemName={`${selectedClient?.firstName} ${selectedClient?.lastName}`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
