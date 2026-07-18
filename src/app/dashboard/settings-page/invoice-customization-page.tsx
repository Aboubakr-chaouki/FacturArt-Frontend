import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    FileText,
    Palette,
    Eye,
    Check,
    Layout,
    Hash,
    Save,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { DocumentRenderer } from "@/components/documents/templates/DocumentRenderer";
import { DocumentData, CompanySettings } from "@/components/documents/templates/types";
import { Separator } from "@/components/ui/separator";
import { useAppToast } from "@/hooks/common/use-app-toast";
import { useDocumentSettings } from "@/hooks/use-document-settings";
import { INVOICE_TEMPLATES, PRESET_COLORS, DocumentSettings } from "@/lib/configs/document-settings";
import { usersApi } from "@/api/users/users.api";

export default function InvoiceCustomizationPage() {
  const { settings: config, setSettings: setConfig, saveSettings, user, refreshUserData } = useDocumentSettings();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useAppToast();

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // 1. Sauvegarde locale pour l'aperçu immédiat
      saveSettings(config);

      // 2. Sauvegarde sur le serveur si l'utilisateur est connecté
      if (user && user.id) {
        // Préparer les données pour l'API
        // On doit envoyer TOUS les champs obligatoires demandés par UserProfileRequestDTO
        const updateData = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          nomCommercial: user.nomCommercial || "",
          formeJuridique: user.formeJuridique || "",
          siret: user.siret || "",
          codeApe: user.codeApe || "",
          numeroTva: user.numeroTva || "",
          adresseSiege: user.adresseSiege || "",
          telephonePro: user.telephonePro || "",
          emailPro: user.emailPro || "",
          iban: user.iban || "",
          rcs: user.rcs || "",
          capital: user.capital || "",
          exonerationTva: !!user.exonerationTva,
          documentTemplate: config.template || user.documentTemplate || "CLASSIC",
          primaryColor: config.primaryColor || user.primaryColor || "#0D3D2E",
          secondaryColor: config.secondaryColor || user.secondaryColor || "#2ECC8E",
          invoicePrefix: (config.invoicePrefix || user.invoicePrefix || "FAC").substring(0, 10),
          quotePrefix: (config.quotePrefix || user.quotePrefix || "DEV").substring(0, 10)
        };

        await usersApi.updateProfile(updateData as any);
        await refreshUserData();
      }

      toast.success("Succès", "Paramètres de personnalisation sauvegardés sur le serveur");
    } catch (error) {
      toast.error("Erreur", "Une erreur est survenue lors de la sauvegarde sur le serveur");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = INVOICE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setConfig(prev => ({
        ...prev,
        template: templateId,
        primaryColor: template.colors.primary,
        secondaryColor: template.colors.secondary
      }));
    }
  };

  const handleApplyPreset = (preset: { primary: string, secondary: string }) => {
    setConfig(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    }));
  };

  return (
    <div className="flex flex-col h-full gap-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-3 tracking-tight text-slate-900 dark:text-zinc-100  border-t pt-4">
            <div>
              <Palette className="size-6 text-primary" />
            </div>
            Personnalisation
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez l'identité visuelle de vos documents commerciaux
          </p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="gap-2 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white" onClick={() => window.location.reload()}>
             Réinitialiser
           </Button>
           <Button className="gap-2 rounded-lg shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95" onClick={handleSaveSettings} disabled={isSaving}>
             <Save className="size-4" /> {isSaving ? "Enregistrement..." : "Enregistrer"}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 relative">
        <div className={`flex flex-col min-h-0 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 ${isSidebarOpen ? "lg:col-span-4 opacity-100" : "lg:col-span-0 opacity-0 hidden"}`}>
          <Tabs defaultValue="appearance" className="flex flex-col h-full">
            <div className="px-6 pt-6 border-b pb-6 bg-slate-50/50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800">
              <TabsList className="grid w-full grid-cols-2 p-1 h-12 bg-slate-100 dark:bg-zinc-800">
                <TabsTrigger value="appearance" className="gap-2 data-[state=active]:shadow-sm rounded-lg">
                  <Layout className="size-4" /> Design
                </TabsTrigger>
                <TabsTrigger value="content" className="gap-2 data-[state=active]:shadow-sm rounded-lg">
                  <FileText className="size-4" /> Contenu
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-600 bg-white dark:bg-zinc-900">
              <TabsContent value="appearance" className="m-0 space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Layout className="size-4" />
                    <h3>Modèle de document</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {INVOICE_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id)}
                        className={`group relative flex flex-col text-left p-4 rounded-lg border-2 transition-all hover:shadow-md bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 ${config.template === template.id ? "border-primary bg-primary/5 ring-4 ring-primary/10" : ""}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-bold text-sm ${config.template === template.id ? "text-primary" : "text-slate-900 dark:text-zinc-100"}`}>{template.name}</span>
                          {config.template === template.id && (
                            <div className="size-5 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                              <Check className="size-3" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                        <div className="mt-auto flex gap-1.5 h-2 items-center">
                           <div className="h-full flex-1 rounded-full shadow-inner" style={{ backgroundColor: template.colors.primary }} />
                           <div className="h-full w-4 rounded-full shadow-inner opacity-70" style={{ backgroundColor: template.colors.secondary }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <Separator className="bg-slate-200 dark:bg-zinc-700" />

                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Palette className="size-4" />
                    <h3>Couleurs de marque</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">Primaire</Label>
                      <div className="flex gap-2">
                        <div className="relative size-12 rounded-xl border-2 border-slate-300 dark:border-zinc-600 overflow-hidden shrink-0 shadow-sm">
                          <Input
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                            className="absolute -inset-2 w-16 h-16 p-0 cursor-pointer border-none bg-transparent"
                          />
                        </div>
                        <Input
                          value={config.primaryColor.toUpperCase()}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="font-mono text-sm h-12 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">Secondaire</Label>
                      <div className="flex gap-2">
                        <div className="relative size-12 rounded-xl border-2 border-slate-300 dark:border-zinc-600 overflow-hidden shrink-0 shadow-sm">
                          <Input
                            type="color"
                            value={config.secondaryColor}
                            onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                            className="absolute -inset-2 w-16 h-16 p-0 cursor-pointer border-none bg-transparent"
                          />
                        </div>
                        <Input
                          value={config.secondaryColor.toUpperCase()}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="font-mono text-sm h-12 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">Palettes recommandées</Label>
                    <div className="flex flex-wrap gap-3">
                      {PRESET_COLORS.map((preset, index) => (
                        <button
                          key={index}
                          className={`group relative size-10 rounded-xl border-2 transition-all hover:scale-110 shadow-sm overflow-hidden ${config.primaryColor.toLowerCase() === preset.primary.toLowerCase() ? "border-primary" : "border-white dark:border-zinc-700"}`}
                          onClick={() => handleApplyPreset(preset)}
                          title={preset.label}
                        >
                          <div className="absolute inset-0 flex flex-col">
                            <div className="h-3/5 w-full" style={{ backgroundColor: preset.primary }} />
                            <div className="h-2/5 w-full" style={{ backgroundColor: preset.secondary }} />
                          </div>
                          {config.primaryColor.toLowerCase() === preset.primary.toLowerCase() && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 text-white backdrop-blur-[1px]">
                               <Check className="size-5 drop-shadow-md" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="content" className="m-0 space-y-8">
                <Separator className="bg-slate-200 dark:bg-zinc-700" />

                <section className="space-y-6">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Hash className="size-4" />
                    <h3>Numérotation des documents</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3 p-4 rounded-xl border bg-slate-100 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700">
                      <Label htmlFor="pre-inv" className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase">Factures</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="pre-inv"
                          maxLength={10}
                          value={config.invoicePrefix}
                          onChange={(e) => setConfig({ ...config, invoicePrefix: e.target.value.toUpperCase().substring(0, 10) })}
                          className="h-11 font-bold tracking-widest text-center rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                        />
                        <Input
                          id="year-inv"
                          value={config.invoiceYear}
                          onChange={(e) => setConfig({ ...config, invoiceYear: e.target.value })}
                          className="h-11 w-28 text-center font-mono rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                        />
                        <span className="text-slate-600 dark:text-zinc-400">-001</span>
                      </div>
                    </div>
                    <div className="space-y-3 p-4 rounded-xl border bg-slate-100 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700">
                      <Label htmlFor="pre-qt" className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase">Devis</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="pre-qt"
                          maxLength={10}
                          value={config.quotePrefix}
                          onChange={(e) => setConfig({ ...config, quotePrefix: e.target.value.toUpperCase().substring(0, 10) })}
                          className="h-11 font-bold tracking-widest text-center rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                        />
                        <Input
                          id="year-qt"
                          value={config.quoteYear}
                          onChange={(e) => setConfig({ ...config, quoteYear: e.target.value })}
                          className="h-11 w-28 text-center font-mono rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                        />
                        <span className="text-slate-600 dark:text-zinc-400">-001</span>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator className="bg-slate-200 dark:bg-zinc-700" />

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <FileText className="size-4" />
                    <h3>Pied de page et mentions</h3>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="footer" className="text-sm font-medium text-slate-700 dark:text-zinc-300">Notes par défaut</Label>
                    <Textarea
                      id="footer"
                      value={config.footerText}
                      onChange={(e) => setConfig({ ...config, footerText: e.target.value })}
                      placeholder="Ex: Merci de votre confiance. Conditions de paiement : 30 jours."
                      rows={6}
                      className="resize-none pt-3 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    />
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400">Ces informations apparaîtront au bas de chaque document émis.</p>
                  </div>
                </section>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className={`flex flex-col min-h-0 rounded-2xl border overflow-hidden shadow-inner transition-all duration-300 ease-in-out bg-slate-100 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 ${isSidebarOpen ? "lg:col-span-8" : "lg:col-span-12"}`}>
          <div className="px-6 py-4 border-b flex justify-between items-center backdrop-blur-md sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 border-slate-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
               <Button
                 variant="ghost"
                 size="icon"
                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                 className="hidden lg:flex rounded-lg dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                 title={isSidebarOpen ? "Masquer les réglages" : "Afficher les réglages"}
               >
                 {isSidebarOpen ? <PanelLeftClose className="size-5" /> : <PanelLeftOpen className="size-5" />}
               </Button>
               <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Eye className="size-4 text-primary" />
               </div>
               <span className="font-bold text-slate-700 dark:text-zinc-200">Aperçu en temps réel</span>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-8 overflow-y-auto scrollbar-thin bg-slate-50 dark:bg-zinc-900">
            <div className={`mx-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm min-h-[1000px] w-full origin-top transition-all duration-500 ease-in-out ${isSidebarOpen ? "max-w-[800px]" : "max-w-[1000px]"}`}>
               <InvoicePreview settings={config} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoicePreview({ settings }: { settings: DocumentSettings }) {
  const company: CompanySettings = useMemo(() => ({
    companyName: settings.companyName || "VOTRE ENTREPRISE",
    companyAddress: settings.companyAddress || "123 Rue de l'Innovation, 75001 Paris",
    companyPhone: settings.companyPhone || "01 23 45 67 89",
    companyEmail: settings.companyEmail || "contact@votre-entreprise.fr",
    siret: settings.siret || "123 456 789 00012",
    tvaIntra: settings.tvaIntra || "FR 12 123456789",
    legalForm: settings.legalForm || "SARL",
    capital: settings.capital || "10 000 €",
    rcs: settings.rcs || "Paris B 123 456 789",
    logoUrl: settings.logoUrl,
    footerText: settings.footerText,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    template: settings.template
  }), [settings]);

  const data: DocumentData = useMemo(() => ({
    type: 'INVOICE',
    number: `${settings.invoicePrefix || 'INV'}-${settings.invoiceYear || new Date().getFullYear()}-001`,
    issueDate: "2024-04-17T09:00:00.000Z",
    dueDate: "2024-05-17T09:00:00.000Z",
    status: 'EN_ATTENTE',
    client: {
      name: "Jean Dupont",
      company: "Client SARL",
      address: "45 Avenue de la République, 75011 Paris",
      email: "jean.dupont@email.fr"
    },
    items: [
      { description: "Prestation de service - Design", quantity: 2, unitPrice: 450, tvaRate: 20, totalHt: 900 },
      { description: "Développement React Frontend", quantity: 5, unitPrice: 600, tvaRate: 20, totalHt: 3000 },
      { description: "Configuration serveur & déploiement", quantity: 1, unitPrice: 300, tvaRate: 20, totalHt: 300 },
    ],
    totalHt: 4200,
    totalTva: 840,
    totalTtc: 5040,
    notes: settings.footerText
  }), [settings]);

  return <DocumentRenderer data={data} settings={company} />;
}

