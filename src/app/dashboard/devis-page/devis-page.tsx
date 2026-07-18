import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Quote } from "@/lib/configs/interface";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { StatusBadge } from "@/components/status-badge";
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
import { QuoteForm } from "./components/quote-form";
import { QuoteDetailModal } from "./components/quote-detail-modal";
import { useQuotes } from "./hooks/use-quotes";

export default function DevisPage() {
  const {
    filteredQuotes,
    isLoading,
    searchTerm,
    setSearchTerm,
    isDialogOpen,
    setIsDialogOpen,
    selectedQuote,
    setSelectedQuote,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    quoteToDelete,
    setQuoteToDelete,
    isDeleting,
    handleQuoteUpdate,
    handleViewDetails,
    handleDeleteQuote,
    fetchQuotes,
    quotes
  } = useQuotes();

  const columns = [
    {
      header: "N° Devis",
      cell: (quote: Quote) => (
        <Badge variant="outline" className="rounded-full font-mono bg-muted/50">
          {quote.quoteNumber}
        </Badge>
      )
    },
    {
      header: "Client",
      cell: (quote: Quote) => (
        <div className="flex flex-col">
          <span className="font-medium">{quote.client.companyName || `${quote.client.firstName} ${quote.client.lastName}`}</span>
          <span className="text-xs text-muted-foreground">{quote.client.email}</span>
        </div>
      )
    },
    { header: "Date", cell: (quote: Quote) => formatDate(quote.issueDate), className: "text-muted-foreground" },
    { header: "Total TTC", cell: (quote: Quote) => <Badge className="rounded-full font-bold">{formatCurrency(quote.totalTtc)}</Badge>, className: "text-right" },
    {
      header: "Statut",
      cell: (quote: Quote) => (
        <div className="flex flex-col gap-1">
          <StatusBadge type="quote" status={quote.status} />
          {quote.status === 'CONVERTI' && quote.invoiceCreatedAt && (
            <span className="text-[10px] text-muted-foreground italic">le {formatDate(quote.invoiceCreatedAt)}</span>
          )}
        </div>
      )
    },
    {
      header: "",
      className: "w-[50px]",
      cell: (quote: Quote) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleViewDetails(quote)}>
              <Eye className="size-4" /> Voir les détails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => { setQuoteToDelete(quote); setIsDeleteModalOpen(true); }}>
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
        title="Mes Devis"
        description="Gérez et suivez vos propositions commerciales."
        icon={FileText}
        addButtonLabel="Nouveau Devis"
        onAddClick={() => setIsDialogOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher un devis..."
      />

      <div className="flex gap-4 ml-auto -mt-2">
        <Badge variant="secondary" className="rounded-full px-3 py-1">Total: {quotes.length}</Badge>
      </div>

      <DataTable
        columns={columns}
        data={filteredQuotes}
        isLoading={isLoading}
        onRowClick={handleViewDetails}
        emptyMessage={searchTerm ? "Aucun résultat pour votre recherche." : "Commencez par créer votre premier devis."}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau devis</DialogTitle>
            <DialogDescription>Remplissez les informations pour générer un nouveau devis.</DialogDescription>
          </DialogHeader>
          <QuoteForm onSuccess={() => { setIsDialogOpen(false); fetchQuotes(); }} />
        </DialogContent>
      </Dialog>

      <QuoteDetailModal 
        quote={selectedQuote}
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setSelectedQuote(null); }}
        onUpdate={handleQuoteUpdate}
        onConvert={handleQuoteUpdate}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title="Supprimer le devis"
        description="Êtes-vous sûr de vouloir supprimer le devis"
        itemName={quoteToDelete?.quoteNumber || ""}
        isLoading={isDeleting}
        onConfirm={handleDeleteQuote}
        onCancel={() => { setIsDeleteModalOpen(false); setQuoteToDelete(null); }}
      />
    </div>
  );
}