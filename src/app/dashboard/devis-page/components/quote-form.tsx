import { Loader2, FileText, User, Calendar, CreditCard, MessageSquare } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useQuoteForm } from "../hooks/use-quote-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentLinesSection } from "@/components/documents/forms/DocumentLinesSection";
import { calculateDocumentTotal } from "@/lib/utils/calculations";

interface QuoteFormProps {
  onSuccess?: () => void;
}

export function QuoteForm({ onSuccess }: QuoteFormProps) {
  const { form, isLoading, onSubmit, clients } = useQuoteForm({
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
                <CardDescription>Détails principaux du devis</CardDescription>
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
                name="validityDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de validité</FormLabel>
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
          title="Articles du devis" 
          description="Détaillez les produits ou services proposés" 
        />

        {/* --- Section Notes --- */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <MessageSquare className="size-5 text-primary" />
              <div>
                <CardTitle className="text-base">Notes & Conditions</CardTitle>
                <CardDescription>Informations additionnelles sur le devis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Notes optionnelles visibles sur le devis (conditions, délais, etc.)..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* --- Section Résumé --- */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-primary" />
              <div>
                <CardTitle className="text-base">Résumé Financier</CardTitle>
                <CardDescription>Total TTC estimé du devis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-end gap-2 p-6 border rounded-xl bg-primary/5 border-primary/20">
              <div className="text-sm font-medium text-muted-foreground">Total TTC du devis</div>
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
              "Créer le devis"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
