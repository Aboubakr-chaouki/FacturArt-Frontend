import { useEffect } from "react";
import { useClientForm } from "@/app/dashboard/clients-page/hook/use-client-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Building2, Mail, Phone, MapPin, FileText } from "lucide-react";
import { Client } from "@/lib/configs/interface/client.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientFormProps {
  mode: "create" | "update";
  clientId?: number;
  initialData?: Client;
  onSuccess?: (client: Client) => void;
  onCancel?: () => void;
}

export const ClientForm = ({
  mode,
  clientId,
  initialData,
  onSuccess,
  onCancel,
}: ClientFormProps) => {
  const { form, isLoading, error, onSubmit } = useClientForm({
    mode,
    clientId,
    onSuccess,
  });

  // Remplir le formulaire avec les données initiales si en mode édition
  useEffect(() => {
    if (mode === "update" && initialData) {
      form.reset({
        lastName: initialData.lastName,
        firstName: initialData.firstName,
        email: initialData.email,
        phone: initialData.phone,
        addressLine1: initialData.addressLine1,
        addressLine2: initialData.addressLine2 || "",
        postalCode: initialData.postalCode,
        city: initialData.city,
        isProfessionnel: initialData.isProfessionnel || false,
        companyName: initialData.companyName || "",
        siret: initialData.siret || "",
        notes: initialData.notes || "",
      });
    }
  }, [mode, initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* --- Section Type de Client --- */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <User className="size-5 text-primary" />
              <div>
                <CardTitle className="text-base">Type de Client</CardTitle>
                <CardDescription>Définissez si le client est un particulier ou un professionnel</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="isProfessionnel"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Client professionnel</FormLabel>
                    <FormDescription>
                      Cochez si le client est une entreprise ou un professionnel
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* --- Section Informations Entreprise (Si Pro) --- */}
        {form.watch("isProfessionnel") && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Building2 className="size-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Informations Entreprise</CardTitle>
                  <CardDescription>Détails légaux de l'entreprise cliente</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'entreprise *</FormLabel>
                    <FormControl>
                      <Input placeholder="FacturArt SARL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIRET</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678901234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}

        {/* --- Section Identité --- */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <User className="size-5 text-primary" />
              <div>
                <CardTitle className="text-base">Identité du Contact</CardTitle>
                <CardDescription>Informations sur la personne de contact</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <FormControl>
                        <Input type="email" placeholder="jean.dupont@example.com" className="pl-9" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                      <FormControl>
                        <Input placeholder="0601020304" className="pl-9" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* --- Section Adresse --- */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-primary" />
              <div>
                <CardTitle className="text-base">Coordonnées Postales</CardTitle>
                <CardDescription>Adresse de facturation du client</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Rue de la Paix" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complément d'adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Appartement, étage..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Postal *</FormLabel>
                    <FormControl>
                      <Input placeholder="75001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville *</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* --- Section Notes --- */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-primary" />
              <div>
                <CardTitle className="text-base">Notes complémentaires</CardTitle>
                <CardDescription>Informations internes relatives au client</CardDescription>
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
                      placeholder="Ajoutez des notes ou informations complémentaires..."
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isLoading} className="min-w-[140px]">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Créer le client" : "Mettre à jour"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
