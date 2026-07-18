import { Mail, Phone, HelpCircle, Send, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { toast } from "sonner"

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    senderName: "",
    senderEmail: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setFormData(prev => ({
          ...prev,
          senderName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          senderEmail: user.email || ""
        }))
        setIsLogged(true)
      } catch (e) {
      }
    }
    
    // Défilement en haut pour une navigation propre
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/support/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setSuccess(true)
        toast.success("Votre message a bien été envoyé !")
        setFormData({ subject: "", content: "", senderName: "", senderEmail: "" })
      } else {
        toast.error("Une erreur est survenue lors de l'envoi.")
      }
    } catch (error) {
      toast.error("Impossible de contacter le serveur.")
    } finally {
      setLoading(false)
    }
  }

  const PageContent = (
    <div className="w-full">
      {/* Header */}
      <div className={!isLogged ? 'flex flex-col items-center text-center w-full mb-12' : 'flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4'}>
        <div className={!isLogged ? 'flex flex-col items-center text-center w-full' : ''}>
          <h1 className={!isLogged ? 'text-4xl md:text-5xl font-extrabold tracking-tight mb-4' : 'text-3xl font-bold tracking-tight dark:text-zinc-100'}>
            Centre d'Aide & Support
          </h1>
          <p className={`text-muted-foreground ${!isLogged ? 'text-lg max-w-2xl mx-auto' : 'text-sm mt-2'}`}>
            Nous sommes là pour vous aider. Trouvez les réponses à vos questions ou contactez notre équipe technique.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12 items-start">
        <Card className="shadow-sm border-gray-100 h-full">
            <CardHeader>
                <CardTitle className="text-xl">Contactez le Support</CardTitle>
                <CardDescription>Décrivez votre problème et notre équipe vous répondra par email.</CardDescription>
            </CardHeader>
            <CardContent>
                {success ? (
                        <div className="bg-green-50 text-green-700 p-6 rounded-lg mb-4 border border-green-100 flex flex-col items-center text-center gap-3">
                        <CheckCircleIcon className="size-12 text-green-500" />
                        <div>
                            <p className="font-semibold text-lg">Message envoyé !</p>
                            <p className="text-sm opacity-90">Nous vous répondrons dans les plus brefs délais sur votre adresse email.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSuccess(false)} className="mt-2">
                            Envoyer un autre message
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Votre Nom</label>
                                <input
                                    required
                                    className="w-full p-2.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
                                    value={formData.senderName}
                                    onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                                    placeholder="Jean Dupont"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Votre Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full p-2.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
                                    value={formData.senderEmail}
                                    onChange={(e) => setFormData({...formData, senderEmail: e.target.value})}
                                    placeholder="jean@exemple.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Sujet</label>
                            <input
                                required
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                placeholder="Problème avec une facture"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <textarea
                                required
                                rows={5}
                                className="w-full p-2.5 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
                                value={formData.content}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                placeholder="Détaillez votre demande ici..."
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:opacity-90 text-primary-foreground py-6" size="lg" disabled={loading}>
                            {loading ? "Envoi en cours..." : <><Send className="mr-2 h-4 w-4" /> Envoyer la demande</>}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>

        <div className="space-y-6 flex flex-col h-full">
            <Card className="shadow-sm border-gray-100 dark:border-zinc-800">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Mail className="size-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Email Direct</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">Préférez-vous nous écrire directement depuis votre messagerie ?</p>
                    <a href="mailto:support@facturart.fr" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group border dark:border-zinc-800">
                        <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">support@facturart.fr</span>
                        <ExternalLink className="size-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-100 dark:border-zinc-800">
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <Phone className="size-5 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-lg">Assistance Téléphonique</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">Nos conseillers vous répondent du lundi au vendredi de 9h à 18h.</p>
                    <a href="tel:+33123456789" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-900 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group border dark:border-zinc-800">
                        <span className="text-sm font-medium text-gray-900 dark:text-zinc-100">+33 1 23 45 67 89</span>
                        <ExternalLink className="size-4 text-gray-400 group-hover:text-gray-600" />
                    </a>
                </CardContent>
            </Card>

        </div>
      </div>

      {/* FAQ */}
      <Card className="mb-12 shadow-sm border-gray-100 dark:border-zinc-800 overflow-hidden">
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
  )

  if (!isLogged) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 pt-16">
        <Header />
        <main className="flex-1 container max-w-4xl py-10 px-6 mx-auto">
          {PageContent}
        </main>
        <Footer />
      </div>
    )
  }

  // Si on est connecté, on peut être soit dans le dashboard, soit sur la page publique direct
  // On regarde si on est dans une URL qui contient /dashboard ou /admin
  const isDashboard = window.location.pathname.includes('/dashboard') || 
                      window.location.pathname.includes('/admin') || 
                      ['/personnalisation', '/profile', '/clients', '/devis', '/factures'].some(path => window.location.pathname === path)

  if (isDashboard) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {PageContent}
        </div>
      </div>
    )
  }

  // Sinon (connecté mais sur /support direct), on affiche la navbar publique
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 pt-16">
      <Header />
      <main className="flex-1 container max-w-4xl py-10 px-6 mx-auto">
        {PageContent}
      </main>
      <Footer />
    </div>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}
