import { useProfile, type UseProfileReturn } from "./hooks/use-profile"
import { type ProfileFormValues } from "@/lib/configs/schemas-zod/form/profile-form-schema"
import { Button } from "@/components/ui/button"
import { DeleteConfirmModal } from "@/components/delete-confirm-modal"
import { useState } from "react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, User, Phone, CreditCard, Upload, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { STATUS_JURIDIQUE } from "@/lib/configs/enums/status-juridique.enums"


export default function ProfilePage() {
    const {form, loading, saving, logoPreview, onFileChange, onSubmit, onDeleteAccount}: UseProfileReturn = useProfile()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const {watch} = form
    const formeJuridique = watch("formeJuridique")
    const isAutoEntrepreneur = formeJuridique === "Auto-entrepreneur"
    const firstName = watch("firstName")
    const lastName = watch("lastName")
    const initials = (firstName?.[0] || "") + (lastName?.[0] || "")

    if (loading) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4">
                <Loader2 className="size-10 animate-spin text-primary"/>
                <p className="text-muted-foreground animate-pulse">Chargement de votre profil...</p>
            </div>
        )
    }

    return (
        <div className="container max-w-5xl mx-auto py-10">
            <div className="mb-8 pt-4 border-t">
                <h1 className="text-3xl font-bold tracking-tight  flex items-center gap-2">
                    <User className="size-8 text-primary" /> Mon Profil
                </h1>
                <p className="text-muted-foreground mt-2">
                    Gérez les informations de votre compte et de votre entreprise.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={onSubmit} className="space-y-8">
                    {/* --- Section Logo --- */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Building2 className="size-5 text-primary"/>
                                <div>
                                    <CardTitle>Logo de l'entreprise</CardTitle>
                                    <CardDescription>Téléchargez votre logo (apparaît sur vos devis et
                                        factures)</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-lg border border-dashed bg-muted/30">
                                <Avatar className="size-24 rounded-lg border-2 border-background shadow-sm">
                                    <AvatarImage src={logoPreview || ""} className="object-cover"/>
                                    <AvatarFallback
                                        className="rounded-lg text-lg font-bold bg-primary text-primary-foreground">
                                        {initials || "FA"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-sm">Importer votre logo</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG ou GIF (max 5MB)
                                        </p>
                                    </div>
                                    <Label htmlFor="logo-upload" className="inline-block">
                                        <div
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                                            <Upload className="size-4"/>
                                            Choisir un fichier
                                        </div>
                                    </Label>
                                    <input
                                        id="logo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={onFileChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- Section Identité Personnelle --- */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <User className="size-5 text-primary"/>
                                <div>
                                    <CardTitle>Identité Personnelle</CardTitle>
                                    <CardDescription>Vos informations personnelles</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField<ProfileFormValues>
                                    control={form.control}
                                    name="firstName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Prénom *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Jean" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField<ProfileFormValues>
                                    control={form.control}
                                    name="lastName"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nom *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Dupont" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField<ProfileFormValues>
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email *</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="jean@example.com" {...field} disabled/>
                                        </FormControl>
                                        <FormDescription>Votre email ne peut pas être modifié</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* --- Section Entreprise --- */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Building2 className="size-5 text-primary"/>
                                <div>
                                    <CardTitle>Informations Entreprise</CardTitle>
                                    <CardDescription>Données légales et administratives de votre
                                        entreprise</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField<ProfileFormValues>
                                control={form.control}
                                name="nomCommercial"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nom commercial / Raison sociale *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ma Super Entreprise" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField<ProfileFormValues>
                                    control={form.control}
                                    name="formeJuridique"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Forme juridique *</FormLabel>
                                            <Select value={field.value || ""} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionnez un statut"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {STATUS_JURIDIQUE.map((status) => (
                                                        <SelectItem key={status} value={status}>
                                                            {status}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField<ProfileFormValues>
                                    control={form.control}
                                    name="siret"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>SIRET *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="12345678901234" maxLength={14} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField<ProfileFormValues>
                                control={form.control}
                                name="codeApe"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Code APE</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: 6201Z" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField<ProfileFormValues>
                                    control={form.control}
                                    name="rcs"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>RCS / RM</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: RCS Paris B 123 456 789" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField<ProfileFormValues>
                                    control={form.control}
                                    name="capital"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Capital social</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: 1000 €" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField<ProfileFormValues>
                                control={form.control}
                                name="adresseSiege"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Adresse du siège social *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 rue de la Paix, 75000 Paris" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* --- Section Contact --- */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Phone className="size-5 text-primary"/>
                                <div>
                                    <CardTitle>Coordonnées Professionnelles</CardTitle>
                                    <CardDescription>Téléphone et email de contact professionnel</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField<ProfileFormValues>
                                    control={form.control}
                                    name="telephonePro"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Téléphone professionnel *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+33 1 23 45 67 89" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField<ProfileFormValues>
                                    control={form.control}
                                    name="emailPro"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email professionnel</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="contact@entreprise.com" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- Section Fiscalité --- */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <CreditCard className="size-5 text-primary"/>
                                <div>
                                    <CardTitle>Fiscalité & Paiement</CardTitle>
                                    <CardDescription>Informations de facturation et coordonnées
                                        bancaires</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!isAutoEntrepreneur && (
                                <FormField<ProfileFormValues>
                                    control={form.control}
                                    name="numeroTva"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>N° TVA intracommunautaire</FormLabel>
                                            <FormControl>
                                                <Input placeholder="FR..." {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField<ProfileFormValues>
                                control={form.control}
                                name="exonerationTva"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Exonération de TVA</FormLabel>
                                            <FormDescription>
                                                Cochez si vous êtes exonéré de TVA (auto-entrepreneur, etc.)
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField<ProfileFormValues>
                                control={form.control}
                                name="iban"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>IBAN</FormLabel>
                                        <FormControl>
                                            <Input placeholder="FR76 3000 1007 9423 0569 0122 026" {...field} />
                                        </FormControl>
                                        <FormDescription>Numéro de compte pour les virements</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>


                    {/* Bouton Enregistrer */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving} className="min-w-[160px]">
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin"/>
                                    Enregistrement...
                                </>
                            ) : (
                                "Enregistrer les modifications"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* --- Section Zone de Danger --- */}
            <div className="mt-12 pt-8 border-t">
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive">Attention</CardTitle>
                        <CardDescription>
                            Suppression définitive de votre compte et de toutes vos données.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-muted-foreground max-w-xl">
                            <p>Une fois votre compte supprimé, il est impossible de revenir en arrière. 
                            <strong> Toutes vos factures, devis et données clients seront définitivement effacés.</strong></p>
                            <p className="mt-2">Un PDF récapitulatif de votre activité sera automatiquement téléchargé avant la suppression.</p>
                        </div>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => setIsDeleteModalOpen(true)}
                            disabled={saving}
                        >
                            Supprimer mon compte
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                title="Supprimer mon compte"
                description="Cette action est irréversible. Toutes vos données seront supprimées. Un récapitulatif PDF sera téléchargé avant la suppression."
                itemName="votre compte"
                onConfirm={onDeleteAccount}
                onCancel={() => setIsDeleteModalOpen(false)}
            />
        </div>
    )
}
