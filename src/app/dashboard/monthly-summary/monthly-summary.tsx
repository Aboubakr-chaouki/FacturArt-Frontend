"use client"

import { useEffect, useState } from "react"
import { dashboardApi, DashboardStats } from "@/api/dashboard/dashboard.api"
import { useAppToast } from "@/hooks/common/use-app-toast"
import { generatePDFFromHTML } from "@/lib/utils/pdf-generator"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import { format, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { createRoot } from "react-dom/client"
import { useDocumentSettings } from "@/hooks/use-document-settings"
import { fetchImageAsBase64, getLogoUrl } from "@/components/documents/templates/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Composant interne pour le document récapitulatif
function MonthlySummaryDocument({ 
  stats, 
  monthName, 
  startDate, 
  endDate,
  logoUrl 
}: { 
  stats: DashboardStats, 
  monthName: string, 
  startDate: Date, 
  endDate: Date,
  logoUrl?: string
}) {
  return (
    <div className="bg-white text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* PAGE 1 - COUVERTURE ET RÉSUMÉ EXÉCUTIF */}

        {/* En-tête professionnel */}
        <div style={{ padding: '40px 50px 30px', borderBottom: '2px solid #1f2937' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <div>
              <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#666', margin: 0, marginBottom: '10px' }}>
                FACTURART
              </p>
              <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#1f2937', margin: 0, lineHeight: '1.2' }}>
                RÉCAPITULATIF<br />D'ACTIVITÉ
              </h1>
            </div>
            {logoUrl && (
              <img 
                src={logoUrl} 
                alt="Logo" 
                style={{ height: '80px', maxWidth: '200px', objectFit: 'contain' }} 
              />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: 0, marginBottom: '5px' }}>
                {monthName.toUpperCase()}
              </p>
              <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                Période : {format(startDate, 'dd MMM', { locale: fr })} au {format(endDate, 'dd MMM yyyy', { locale: fr })}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#666', margin: 0 }}>
                Généré le {format(new Date(), 'dd/MM/yyyy', { locale: fr })}
              </p>
            </div>
          </div>
        </div>

        {/* KPIs Principaux */}
        <div style={{ padding: '40px 50px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', borderBottom: '1px solid #e5e7eb' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#999', margin: 0, marginBottom: '12px' }}>
              CHIFFRE D'AFFAIRES HT
            </p>
            <p style={{ fontSize: '36px', fontWeight: '900', color: '#1f2937', margin: 0, marginBottom: '8px' }}>
              {stats.monthlyRevenue.toLocaleString('fr-FR')} €
            </p>
            <p style={{ fontSize: '12px', color: `${stats.revenueGrowth >= 0 ? '#059669' : '#dc2626'}`, margin: 0, fontWeight: '600' }}>
              {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth).toFixed(1)}% vs mois précédent
            </p>
          </div>

          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#999', margin: 0, marginBottom: '12px' }}>
              DEVIS VALIDÉS
            </p>
            <p style={{ fontSize: '36px', fontWeight: '900', color: '#1f2937', margin: 0, marginBottom: '8px' }}>
              {stats.quotesValidatedThisMonth}
            </p>
            <p style={{ fontSize: '12px', color: '#666', margin: 0, fontWeight: '600' }}>
              Taux : {stats.conversionRate.toFixed(1)}%
            </p>
          </div>

          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#999', margin: 0, marginBottom: '12px' }}>
              FACTURES IMPAYÉES
            </p>
            <p style={{ fontSize: '36px', fontWeight: '900', color: '#dc2626', margin: 0, marginBottom: '8px' }}>
              {stats.unpaidInvoicesCount}
            </p>
            <p style={{ fontSize: '12px', color: '#dc2626', margin: 0, fontWeight: '600' }}>
              {stats.unpaidAmount.toLocaleString('fr-FR')} €
            </p>
          </div>
        </div>

        {/* Graphique */}
        <div style={{ padding: '40px 50px', borderBottom: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#999', margin: 0, marginBottom: '25px' }}>
            ÉVOLUTION DU CHIFFRE D'AFFAIRES - 6 DERNIERS MOIS
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '8px' }}>
            {stats.revenueEvolution.map((item, idx) => {
              const maxRevenue = Math.max(...stats.revenueEvolution.map(e => Number(e.amount)), 1)
              const height = (Number(item.amount) / maxRevenue) * 100
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${Math.max(height, 8)}%`,
                      backgroundColor: '#1f2937',
                      marginBottom: '12px'
                    }}
                  />
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#374151', margin: 0, textAlign: 'center' }}>
                    {item.month}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats additionnelles */}
        <div style={{ padding: '40px 50px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px', borderBottom: '1px solid #e5e7eb' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#999', margin: 0, marginBottom: '12px' }}>
              DEVIS EN ATTENTE
            </p>
            <p style={{ fontSize: '32px', fontWeight: '900', color: '#1f2937', margin: 0 }}>
              {stats.pendingQuotesCount}
            </p>
          </div>

          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#999', margin: 0, marginBottom: '12px' }}>
              FACTURES CE MOIS
            </p>
            <p style={{ fontSize: '32px', fontWeight: '900', color: '#1f2937', margin: 0 }}>
              {stats.recentInvoices.length}
            </p>
          </div>

          <div>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#999', margin: 0, marginBottom: '12px' }}>
              TOTAL TVA
            </p>
            <p style={{ fontSize: '32px', fontWeight: '900', color: '#1f2937', margin: 0 }}>
              {stats.recentInvoices.reduce((sum, inv) => sum + inv.totalTva, 0).toLocaleString('fr-FR')} €
            </p>
          </div>
        </div>

        {/* Top Clients */}
        <div style={{ padding: '40px 50px', borderBottom: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#999', margin: 0, marginBottom: '25px' }}>
            TOP 5 - MEILLEURS CLIENTS
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <tbody>
              {stats.topClients.map((client, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '700', color: '#1f2937', width: '30px' }}>
                    {idx + 1}.
                  </td>
                  <td style={{ padding: '12px 0', fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                    {client.name}
                  </td>
                  <td style={{ padding: '12px 0', fontSize: '13px', fontWeight: '700', color: '#1f2937', textAlign: 'right' }}>
                    {client.totalAmount.toLocaleString('fr-FR')} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tableau des factures */}
        {stats.recentInvoices.length > 0 && (
          <div style={{ padding: '40px 50px', borderBottom: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#999', margin: 0, marginBottom: '25px' }}>
              FACTURES DU MOIS
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #1f2937' }}>
                  <th style={{ padding: '12px 0', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#1f2937', textAlign: 'left' }}>
                    N° FACTURE
                  </th>
                  <th style={{ padding: '12px 0', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#1f2937', textAlign: 'left' }}>
                    CLIENT
                  </th>
                  <th style={{ padding: '12px 0', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#1f2937', textAlign: 'center' }}>
                    MONTANT HT
                  </th>
                  <th style={{ padding: '12px 0', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#1f2937', textAlign: 'center' }}>
                    TVA
                  </th>
                  <th style={{ padding: '12px 0', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#1f2937', textAlign: 'right' }}>
                    MONTANT TTC
                  </th>
                  <th style={{ padding: '12px 0', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#1f2937', textAlign: 'center' }}>
                    STATUT
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentInvoices.slice(0, 20).map((invoice) => (
                  <tr key={invoice.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '10px 0', fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>
                      {invoice.invoiceNumber}
                    </td>
                    <td style={{ padding: '10px 0', fontSize: '12px', color: '#374151' }}>
                      {invoice.client?.companyName || `${invoice.client?.firstName} ${invoice.client?.lastName}`}
                    </td>
                    <td style={{ padding: '10px 0', fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                      {invoice.totalHt.toLocaleString('fr-FR')} €
                    </td>
                    <td style={{ padding: '10px 0', fontSize: '12px', color: '#374151', textAlign: 'center' }}>
                      {invoice.totalTva.toLocaleString('fr-FR')} €
                    </td>
                    <td style={{ padding: '10px 0', fontSize: '12px', fontWeight: '700', color: '#1f2937', textAlign: 'right' }}>
                      {invoice.totalTtc.toLocaleString('fr-FR')} €
                    </td>
                    <td style={{ padding: '10px 0', fontSize: '11px', fontWeight: '600', color: invoice.status === 'PAYEE' ? '#059669' : '#f97316', textAlign: 'center' }}>
                      {invoice.status === 'PAYEE' ? '✓ PAYÉE' : 'EN ATTENTE'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pied de page */}
        <div style={{ padding: '30px 50px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#666', margin: 0, marginBottom: '5px', fontWeight: '600' }}>
            Ce document a été généré automatiquement par FacturArt
          </p>
          <p style={{ fontSize: '10px', color: '#999', margin: 0 }}>
            {monthName} • Gestion professionnelle des factures et devis
          </p>
        </div>
    </div>
  )
}

export default function MonthlySummaryPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { settings } = useDocumentSettings()
  // État pour le dashboard (mois actuel)
  const [dashboardMonth] = useState(new Date())
  // État séparé pour la sélection PDF (indépendant du dashboard)
  const [pdfSelectedMonth, setPdfSelectedMonth] = useState(new Date())
  const [isGenerating, setIsGenerating] = useState(false)
  const toast = useAppToast()

  // Créer une liste des 12 derniers mois pour le sélecteur PDF
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      value: date.toISOString().split('T')[0].slice(0, 7),
      label: format(date, 'MMMM yyyy', { locale: fr }),
      date: date
    }
  })

  // Charger les données du mois ACTUEL du dashboard (ne change jamais)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const month = dashboardMonth.getMonth() + 1
        const year = dashboardMonth.getFullYear()

        const data = await dashboardApi.getStats(month, year)
        setStats(data)
      } catch (error) {
        toast.error("Erreur", "Impossible de charger les données")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [dashboardMonth, toast])

  const handlePreviousPdfMonth = () => {
    setPdfSelectedMonth(subMonths(pdfSelectedMonth, 1))
  }

  const handleNextPdfMonth = () => {
    const nextMonth = subMonths(pdfSelectedMonth, -1)
    if (nextMonth <= new Date()) {
      setPdfSelectedMonth(nextMonth)
    }
  }

  const handlePdfMonthChange = (value: string) => {
    const selected = monthOptions.find(opt => opt.value === value)
    if (selected) {
      setPdfSelectedMonth(selected.date)
    }
  }

  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      // 1. Charger les statistiques pour le mois sélectionné
      const month = pdfSelectedMonth.getMonth() + 1
      const year = pdfSelectedMonth.getFullYear()
      const pdfStats = await dashboardApi.getStats(month, year)
      
      const monthStr = format(pdfSelectedMonth, 'MMMM_yyyy', { locale: fr })
      const pdfStartDate = new Date(pdfSelectedMonth.getFullYear(), pdfSelectedMonth.getMonth(), 1)
      const pdfEndDate = new Date(pdfSelectedMonth.getFullYear(), pdfSelectedMonth.getMonth() + 1, 0)

      // 2. Préparer le conteneur pour le rendu invisible
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.style.width = '210mm'
      document.body.appendChild(container)

      // 3. Gérer le logo
      const logoUrl = getLogoUrl(settings.logoUrl)
      let base64Logo = undefined
      if (logoUrl) {
        base64Logo = await fetchImageAsBase64(logoUrl)
      }

      const root = createRoot(container)
      root.render(
        <div style={{ width: '210mm', backgroundColor: 'white' }}>
           <MonthlySummaryDocument 
             stats={pdfStats} 
             monthName={format(pdfSelectedMonth, 'MMMM yyyy', { locale: fr })}
             startDate={pdfStartDate}
             endDate={pdfEndDate}
             logoUrl={base64Logo}
           />
        </div>
      )

      // Attendre le rendu
      await new Promise(resolve => setTimeout(resolve, 1000))

      const element = container.firstElementChild as HTMLElement
      if (element) {
        await generatePDFFromHTML(element, `Recapitulatif_${monthStr}.pdf`, {
          orientation: 'portrait',
          format: 'a4'
        })
        toast.success("Succès", "Récapitulatif téléchargé")
      }
      
      document.body.removeChild(container)
    } catch (error) {
      toast.error("Erreur", "Impossible de générer le PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!stats) return null

  const dashboardMonthName = format(dashboardMonth, 'MMMM yyyy', { locale: fr })
  const pdfMonthName = format(pdfSelectedMonth, 'MMMM yyyy', { locale: fr })
  const startDate = new Date(dashboardMonth.getFullYear(), dashboardMonth.getMonth(), 1)
  const endDate = new Date(dashboardMonth.getFullYear(), dashboardMonth.getMonth() + 1, 0)

  return (
    <div className="w-full">
      {/* Contrôles */}
      <div className="flex justify-between items-center mb-8 mt-6">
        <div>
          <h1 className="text-3xl font-bold">Récapitulatif mensuel</h1>
          <p className="text-sm text-muted-foreground mt-2 capitalize">{pdfMonthName}</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={format(pdfSelectedMonth, 'yyyy-MM')} onValueChange={handlePdfMonthChange}>
            <SelectTrigger className="w-48 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handlePreviousPdfMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleNextPdfMonth}
            disabled={subMonths(pdfSelectedMonth, -1) > new Date()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button 
            onClick={handleDownloadPDF} 
            disabled={isGenerating}
            className="gap-2 rounded-full bg-primary hover:bg-primary/90"
          >
            {isGenerating ? (
               <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
            ) : (
               <Download className="h-4 w-4" />
            )}
            {isGenerating ? "Génération..." : "PDF"}
          </Button>
        </div>
      </div>

      {/* Document PDF - Aperçu écran */}
      <div id="monthly-summary-content">
        <MonthlySummaryDocument 
          stats={stats}
          monthName={dashboardMonthName}
          startDate={startDate}
          endDate={endDate}
          logoUrl={settings.logoUrl}
        />
      </div>

      <style>{`
        @media print {
          @page { margin: 0; }
          body { margin: 0; padding: 0; background: white; }
          #monthly-summary-content {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: white;
            color: black;
          }
        }
      `}</style>
    </div>
  )
}
