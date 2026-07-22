import { Loader2, FileText, User, Calendar, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoiceForm } from "../hooks/use-invoice-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentLinesSection } from "@/components/documents/forms/DocumentLinesSection";
import { calculateDocumentTotal } from "@/lib/utils/calculations";

interface InvoiceFormProps {
  onSuccess?: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const { form, isLoading, onSubmit, clients } = useInvoiceForm({
    onSuccess: () => onSuccess?.(),
  });

  const calculateTotal = () => {
    return calculateDocumentTotal(form.watch("lines"));
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* --- Section Informations Générales --- */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-primary" />
              <div>
                <CardTitle className="text-base">Informations Générales</CardTitle>
                <CardDescription>Détails principaux de la facture</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 size-4 text-muted-foreground z-10" />
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Sélectionner un client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.companyName || `${client.firstName} ${client.lastName}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EN_ATTENTE">En attente</SelectItem>
                        <SelectItem value="PAYEE">Payée</SelectItem>
                        <SelectItem value="EN_RETARD">En retard</SelectItem>
                        <SelectItem value="ANNULEE">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'émission</FormLabel>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 size-4 text-muted-foreground z-10" />
                      <FormControl>
                        <Input type="date" className="pl-9" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'échéance</FormLabel>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 size-4 text-muted-foreground z-10" />
                      <FormControl>
                        <Input type="date" className="pl-9" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <DocumentLinesSection 
          form={form} 
          title="Articles de la facture" 
          description="Détaillez les produits ou services facturés" 
        />

        {/* --- Section Paiement & Total --- */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-primary" />
              <div>
                <CardTitle className="text-base">Paiement & Total</CardTitle>
                <CardDescription>Mode de règlement et résumé financier</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une méthode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="VIREMENT">Virement bancaire</SelectItem>
                      <SelectItem value="CARTE">Carte bancaire</SelectItem>
                      <SelectItem value="ESPECES">Espèces</SelectItem>
                      <SelectItem value="CHEQUE">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col items-end gap-2 p-6 border rounded-xl bg-primary/5 border-primary/20">
              <div className="text-sm font-medium text-muted-foreground">Total TTC de la facture</div>
              <div className="text-3xl font-bold text-primary">
                {calculateTotal().toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="min-w-[160px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Créer la facture"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
