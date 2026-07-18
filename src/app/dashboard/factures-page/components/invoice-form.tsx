import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, Loader2, FileText, User, Calendar, CreditCard, List } from "lucide-react";
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
import { useEffect, useState } from "react";
import { clientsApi } from "@/api/clients/clients.api";
import { Client } from "@/lib/configs/interface/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceFormProps {
  onSuccess?: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const { form, isLoading, onSubmit } = useInvoiceForm({
    onSuccess: () => onSuccess?.(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientsApi.getAll();
        setClients(data);
      } catch (error) {
      }
    };
    fetchClients();
  }, []);

  const calculateTotal = () => {
    const lines = form.watch("lines") || [];
    return lines.reduce((acc, line) => {
      const quantity = Number(line.quantity) || 0;
      const unitPrice = Number(line.unitPrice) || 0;
      const tvaRate = Number(line.tvaRate) || 0;
      const ht = quantity * unitPrice;
      const tva = ht * (tvaRate / 100);
      return acc + ht + tva;
    }, 0);
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

        {/* --- Section Articles --- */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <List className="size-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Articles de la facture</CardTitle>
                  <CardDescription>Détaillez les produits ou services facturés</CardDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={() =>
                  append({ description: "", quantity: 1, unitPrice: 0, tvaRate: 20 })
                }
              >
                <Plus className="size-3.5" /> Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border p-3 rounded-lg bg-muted/30 transition-colors hover:bg-muted/50"
              >
                <div className="md:col-span-5">
                  <FormField
                    control={form.control}
                    name={`lines.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index > 0 ? "sr-only" : "text-xs"}>
                          Description
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Description de l'article" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`lines.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index > 0 ? "sr-only" : "text-xs"}>
                          Qté
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`lines.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index > 0 ? "sr-only" : "text-xs"}>
                          Prix Unitaire
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`lines.${index}.tvaRate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index > 0 ? "sr-only" : "text-xs"}>
                          TVA %
                        </FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5.5">5.5%</SelectItem>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="20">20%</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive h-9 w-9"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

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
