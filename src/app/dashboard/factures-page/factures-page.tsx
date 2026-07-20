import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReceiptEuro, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Invoice } from "@/lib/configs/interface";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/layout/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvoiceForm } from "./components/invoice-form";
import { InvoiceDetailModal } from "./components/invoice-detail-modal";
import { StatusBadge } from "@/components/status-badge";
import { useInvoices } from "./hooks/use-invoices";

export default function FacturesPage() {
  const {
    filteredInvoices,
    isLoading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    selectedInvoice,
    setSelectedInvoice,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    invoiceToDelete,
    setInvoiceToDelete,
    isDeleting,
    handleInvoiceUpdate,
    handleViewDetails,
    handleDeleteInvoice,
    fetchInvoices,
    invoices
  } = useInvoices();

  const columns = [
    {
      header: "N° Facture",
      cell: (invoice: Invoice) => (
        <Badge variant="outline" className="rounded-full font-mono bg-muted/50">
          {invoice.invoiceNumber}
        </Badge>
      )
    },
    {
      header: "Client",
      cell: (invoice: Invoice) => (
        <div className="flex flex-col">
          <span className="font-medium">{invoice.client.companyName || `${invoice.client.firstName} ${invoice.client.lastName}`}</span>
          <span className="text-xs text-muted-foreground">{invoice.client.email}</span>
        </div>
      )
    },
    { header: "Date", cell: (invoice: Invoice) => formatDate(invoice.issueDate), className: "text-muted-foreground" },
    { header: "Total TTC", cell: (invoice: Invoice) => <Badge className="rounded-full font-bold">{formatCurrency(invoice.totalTtc)}</Badge>, className: "text-right" },
    { header: "Statut", cell: (invoice: Invoice) => <StatusBadge type="invoice" status={invoice.status} /> },
    {
      header: "",
      className: "w-[50px]",
      cell: (invoice: Invoice) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleViewDetails(invoice)}>
              <Eye className="size-4" /> Voir les détails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => { setInvoiceToDelete(invoice); setIsDeleteModalOpen(true); }}>
              <Trash2 className="size-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mes Factures"
        description="Suivez vos paiements et gérez vos factures."
        icon={ReceiptEuro}
        addButtonLabel="Nouvelle Facture"
        onAddClick={() => setIsDialogOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher une facture..."
      />

      <div className="flex gap-4 ml-auto -mt-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1">Total: {invoices.length}</Badge>
      </div>

      <DataTable
        columns={columns}
        data={filteredInvoices}
        isLoading={isLoading}
        onRowClick={handleViewDetails}
        emptyMessage={searchTerm ? "Aucun résultat pour votre recherche." : "Vous n'avez pas encore créé de facture."}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle facture</DialogTitle>
            <DialogDescription>Remplissez les informations pour générer une nouvelle facture.</DialogDescription>
          </DialogHeader>
          <InvoiceForm onSuccess={() => { setIsDialogOpen(false); fetchInvoices(); }} />
        </DialogContent>
      </Dialog>

      <InvoiceDetailModal 
        invoice={selectedInvoice}
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setSelectedInvoice(null); }}
        onUpdate={handleInvoiceUpdate}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Supprimer la facture"
        description="Êtes-vous sûr de vouloir supprimer la facture"
        itemName={invoiceToDelete?.invoiceNumber || ""}
        isLoading={isDeleting}
        onConfirm={handleDeleteInvoice}
        onCancel={() => { setIsDeleteModalOpen(false); setInvoiceToDelete(null); }}
      />
    </div>
  );
}