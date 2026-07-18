"use client"

import { useState } from "react"
import {
    Download,
    Calendar
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format, eachMonthOfInterval, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { dashboardApi } from "@/api/dashboard/dashboard.api"
import { useDocumentSettings } from "@/hooks/use-document-settings"
import { generatePDFFromHTML } from "@/lib/utils/pdf-generator"
import { MonthlyReportTemplate } from "@/components/documents/reports/MonthlyReportTemplate"
import { createRoot } from "react-dom/client"
import { fetchImageAsBase64, getLogoUrl } from "@/components/documents/templates/utils"
import { useAppToast } from "@/hooks/common/use-app-toast"

interface MonthlyReportModalProps {
    isOpen: boolean
    onClose: () => void
}

export function MonthlyReportModal({ isOpen, onClose }: MonthlyReportModalProps) {
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
    const { settings } = useDocumentSettings()
    const toast = useAppToast()

    // Générer la liste des 12 derniers mois
    const last12Months = eachMonthOfInterval({
        start: subMonths(new Date(), 11),
        end: new Date(),
    }).reverse()

    const handleDownloadReport = async () => {
        setIsGeneratingPDF(true)
        
        try {
            // Charger les statistiques spécifiques pour le mois sélectionné
            const month = selectedMonth.getMonth() + 1
            const year = selectedMonth.getFullYear()
            const reportStats = await dashboardApi.getStats(month, year)
            const reportMonthLabel = format(selectedMonth, "MMMM yyyy", { locale: fr })

            // Préparer le conteneur pour le rendu invisible
            const container = document.createElement('div')
            container.style.position = 'absolute'
            container.style.left = '-9999px'
            container.style.top = '0'
            container.style.width = '210mm' // Largeur A4
            document.body.appendChild(container)

            // Gérer le logo en base64 pour éviter les problèmes de CORS dans le PDF
            const logoUrl = getLogoUrl(settings.logoUrl)
            let base64Logo = undefined
            if (logoUrl) {
                base64Logo = await fetchImageAsBase64(logoUrl)
            }

            const reportSettings = {
                ...settings,
                logoUrl: base64Logo
            }

            const root = createRoot(container)
            root.render(
                <div style={{ width: '210mm', minHeight: '297mm', backgroundColor: 'white' }}>
                    <MonthlyReportTemplate 
                        stats={reportStats} 
                        settings={reportSettings} 
                        period={reportMonthLabel} 
                    />
                </div>
            )

            // Attendre un peu que le rendu soit terminé et que les images soient chargées
            await new Promise(resolve => setTimeout(resolve, 1000))

            const element = document.getElementById('report-content')
            if (element) {
                await generatePDFFromHTML(element, `Recapitulatif_${reportMonthLabel.replace(' ', '_')}.pdf`)
            } else {
                // Si l'ID n'est pas trouvé immédiatement, on capture le container
                await generatePDFFromHTML(container.firstElementChild as HTMLElement, `Recapitulatif_${reportMonthLabel.replace(' ', '_')}.pdf`)
            }

            // Nettoyage
            document.body.removeChild(container)
            toast.success("Succès", "Récapitulatif généré avec succès")
            onClose()
        } catch (err) {
            toast.error("Erreur", "Impossible de générer le récapitulatif")
        } finally {
            setIsGeneratingPDF(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[380px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Récapitulatif Professionnel
                    </DialogTitle>
                    <DialogDescription>
                        Sélectionnez le mois pour lequel vous souhaitez générer un rapport d'activité détaillé.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-6">
                    <label className="text-sm font-medium mb-2 block">
                        Mois à analyser
                    </label>
                    <select 
                        value={selectedMonth.toISOString()} 
                        onChange={(e) => setSelectedMonth(new Date(e.target.value))}
                        className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                        {last12Months.map((date) => (
                            <option key={date.toISOString()} value={date.toISOString()}>
                                {format(date, "MMMM yyyy", { locale: fr })}
                            </option>
                        ))}
                    </select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isGeneratingPDF}>
                        Annuler
                    </Button>
                    <Button 
                        onClick={handleDownloadReport} 
                        disabled={isGeneratingPDF}
                        className="gap-2"
                    >
                        {isGeneratingPDF ? (
                            <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                        {isGeneratingPDF ? "Génération..." : "Télécharger le PDF"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
