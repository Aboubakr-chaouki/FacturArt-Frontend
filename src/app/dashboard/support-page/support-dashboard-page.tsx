import { Mail, HelpCircle, ExternalLink, ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { useSupport } from "./hooks/use-support";
import { SupportForm } from "./components/support-form";

export default function SupportDashboardPage() {
  const {
    formData,
    setFormData,
    loading,
    success,
    handleSubmit,
    resetSuccess
  } = useSupport();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Centre d'Aide & Support"
        description="Nous sommes là pour vous aider. Trouvez les réponses à vos questions ou contactez notre équipe technique."
        icon={HelpCircle}
      />

      <div className="grid gap-8 md:grid-cols-2 items-start">
        <Card className="shadow-sm border-gray-100 rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl">Contactez le Support</CardTitle>
            <CardDescription>Décrivez votre problème et notre équipe vous répondra par email.</CardDescription>
          </CardHeader>
          <CardContent>
            <SupportForm
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              success={success}
              handleSubmit={handleSubmit}
              resetSuccess={resetSuccess}
            />
          </CardContent>
        </Card>

        <div className="space-y-6 flex flex-col h-full">
          <Card className="shadow-sm border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Mail className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Email Direct</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Préférez-vous nous écrire directement depuis votre messagerie ?</p>
              <a href="mailto:support@facturart.fr" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group border dark:border-zinc-800">
                <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">support@facturart.fr</span>
                <ExternalLink className="size-4 text-gray-400 group-hover:text-gray-600" />
              </a>
            </CardContent>
          </Card>

        </div>
      </div>

      <Card className="shadow-sm border-gray-100 dark:border-zinc-800 overflow-hidden rounded-2xl">
        <CardHeader className="bg-gray-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <HelpCircle className="size-6 text-green-600 dark:text-green-400" />
            <div>
              <CardTitle>Questions Fréquentes</CardTitle>
              <CardDescription>Trouvez rapidement les réponses à vos questions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {[
              { q: "Comment créer une facture ?", a: "Accédez à l'onglet 'Factures', cliquez sur 'Nouvelle facture', sélectionnez vos clients et articles, puis générez le PDF." },
              { q: "Comment ajouter mes coordonnées bancaires ?", a: "Allez dans 'Mon Profil' section 'Fiscalité & Paiement' et remplissez votre IBAN. Ces informations apparaîtront sur vos factures." },
              { q: "Comment gérer mes clients ?", a: "Utilisez la section 'Clients' pour ajouter, modifier ou supprimer vos clients. Vous pouvez aussi importer vos contacts." },
              { q: "Comment créer un devis ?", a: "Dans la section 'Devis', cliquez sur 'Nouveau devis', remplissez les détails et les articles, puis envoyez-le à votre client." },
              { q: "Comment exporter mes données ?", a: "Vous pouvez exporter vos factures et clients en PDF ou Excel depuis chaque section. Les données restent vôtres." },
              { q: "Puis-je modifier une facture déjà envoyée ?", a: "Non, les factures envoyées sont verrouillées pour respecter la conformité légale. Vous pouvez créer un avoir ou une nouvelle facture." },
              { q: "Comment utiliser les modèles de factures ?", a: "Vous pouvez personnaliser le modèle de facture par défaut dans les paramètres. Votre logo, couleurs et conditions apparaîtront automatiquement." }
            ].map((item, i) => (
              <details key={i} className="group transition-all">
                <summary className="font-medium flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 list-none dark:text-zinc-100">
                  <span className="pr-6">{item.q}</span>
                  <ChevronDown className="size-4 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 pt-0 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
