"use client"

import {
    EuroIcon,
    FileClockIcon,
    AlertCircleIcon,
    TrendingUpIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    CheckCircle2Icon,
    Download
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { MonthlyReportModal } from "./components/monthly-report-modal"
import { useDashboard } from "./hooks/use-dashboard"


export default function DashboardPage() {
    const {
        stats,
        loading,
        error,
        isModalOpen,
        setIsModalOpen,
        revenueChartData,
        topClientsChartData,
        monthlyRevenue,
        unpaidAmount,
        revenueGrowth,
        conversionRate
    } = useDashboard();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement du tableau de bord...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center max-w-md">
                    <AlertCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Erreur du dashboard</h2>
                    <p className="text-muted-foreground mb-4">{error || "Les données du dashboard ne sont pas disponibles"}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90"
                    >
                        Recharger la page
                    </button>
                </div>
            </div>
        );
    }

    // Couleurs pour les barres (dégradé simulé avec Cell)
    const CHART_COLORS = ['#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 mt-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-zinc-100">Tableau de bord Artisan</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Bienvenue sur FacturArt, voici un aperçu de votre activité.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                    >
                        <Download className="h-4 w-4" />
                        Récapitulatif Pro
                    </Button>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8" id="dashboard-summary">
                {/* CA du mois */}
                <Card className="border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">CA du mois (HT)</CardTitle>
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-950 rounded-lg">
                            <EuroIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{monthlyRevenue.toLocaleString('fr-FR')} €</div>
                        <p className={`text-xs flex items-center mt-2 font-medium ${revenueGrowth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {revenueGrowth >= 0 ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
                            {Math.abs(revenueGrowth).toFixed(1)}% par rapport au mois dernier
                        </p>
                    </CardContent>
                </Card>

                {/* Devis en attente */}
                <Card className="border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Devis en attente</CardTitle>
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-950 rounded-lg">
                            <FileClockIcon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.pendingQuotesCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-2">devis en cours (brouillons + envoyés)</p>
                    </CardContent>
                </Card>

                {/* Factures impayées */}
                <Card className="border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Factures impayées</CardTitle>
                        <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                            <AlertCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600 dark:text-red-400">{unpaidAmount.toLocaleString('fr-FR')} €</div>
                        <p className="text-xs text-muted-foreground mt-2">{stats.unpaidInvoicesCount || 0} factures en retard</p>
                    </CardContent>
                </Card>

                {/* Taux de conversion */}
                <Card className="border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
                        <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                            <TrendingUpIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{conversionRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground mt-2">{stats.quotesValidatedThisMonth || 0} devis convertis en facture ce mois</p>
                    </CardContent>
                </Card>
            </div>

            {/* Graphiques avec Recharts */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-8">
                {/* Graphique Chiffre d'affaires */}
                <Card className="lg:col-span-4 border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Évolution du chiffre d'affaires</CardTitle>
                        <CardDescription>Derniers 6 mois (HT)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            {revenueChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis 
                                            dataKey="month" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fill: '#64748b' }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fontSize: 12, fill: '#64748b' }} 
                                        />
                                        <Tooltip 
                                            cursor={{ fill: '#f1f5f9' }}
                                            contentStyle={{ 
                                                borderRadius: '8px', 
                                                border: 'none', 
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                fontSize: '14px'
                                            }}
                                            formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} €`, 'CA HT']}
                                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                                        />
                                        <Bar 
                                            dataKey="revenue" 
                                            fill="#3b82f6" 
                                            radius={[4, 4, 0, 0]} 
                                            barSize={40}
                                        >
                                            {revenueChartData.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full border-2 border-dashed border-slate-100 rounded-xl">
                                    <p className="text-muted-foreground">Aucune donnée de CA disponible</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top clients */}
                <Card className="lg:col-span-3 border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Top 5 clients</CardTitle>
                        <CardDescription>Par chiffre d'affaires (TTC)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {topClientsChartData.length > 0 ? (
                            <div className="space-y-6 mt-4">
                                {topClientsChartData.map((client, idx: number) => {
                                    const maxValue = Math.max(...topClientsChartData.map((d) => d.value), 1);
                                    const percentage = (client.value / maxValue) * 100;
                                    return (
                                        <div key={idx} className="space-y-2 group">
                                            <div className="flex justify-between text-sm items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] font-bold text-slate-500">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="font-semibold truncate max-w-[150px]">{client.name}</span>
                                                </div>
                                                <span className="font-bold text-primary">{client.value.toLocaleString('fr-FR')} €</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[280px] border-2 border-dashed border-slate-100 rounded-xl">
                                <p className="text-muted-foreground">Aucune donnée client disponible</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Factures récentes */}
            <Card className="border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Factures récentes</CardTitle>
                    <CardDescription>Vos 5 dernières factures émises</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b dark:[&_tr]:border-slate-800">
                                <tr className="border-b dark:border-zinc-800 transition-colors">
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground w-[120px]">N° Facture</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Client</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground">Total TTC</th>
                                    <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {(stats.recentInvoices || []).length > 0 ? (
                                    stats.recentInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="border-b dark:border-zinc-800 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900">
                                            <td className="p-4 align-middle font-medium text-sm">
                                                <Badge variant="outline" className="rounded-full font-mono">
                                                    {invoice.invoiceNumber || "N/A"}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                                        {(invoice.client?.companyName || invoice.client?.firstName || "?").charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="truncate">
                                                        {invoice.client?.companyName || (invoice.client ? `${invoice.client.firstName} ${invoice.client.lastName}` : "Client Inconnu")}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-sm text-muted-foreground">
                                                {invoice.issueDate ? format(new Date(invoice.issueDate), "dd MMM yyyy", { locale: fr }) : "-"}
                                            </td>
                                            <td className="p-4 align-middle text-sm font-semibold text-right">
                                                {Number(invoice.totalTtc || 0).toLocaleString('fr-FR')} €
                                            </td>
                                            <td className="p-4 align-middle">
                                                    <Badge
                                                        variant="outline"
                                                        className={`rounded-full ${
                                                            invoice.status === 'PAYEE' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' :
                                                            invoice.status === 'ANNULEE' ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' :
                                                            invoice.status === 'EN_RETARD' ? 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' :
                                                            'bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
                                                        }`}
                                                    >
                                                    {invoice.status === 'PAYEE' && <CheckCircle2Icon className="h-3 w-3 mr-1" />}
                                                    {invoice.status === 'PAYEE' ? 'Payée' :
                                                     invoice.status === 'ANNULEE' ? 'Annulée' :
                                                     invoice.status === 'EN_RETARD' ? 'En retard' :
                                                     'En attente'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            Aucune facture récente
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <MonthlyReportModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    )
}