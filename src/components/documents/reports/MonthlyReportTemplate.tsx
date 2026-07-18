import React from 'react';
import { formatCurrency } from '../templates/utils';
import { CompanySettings } from '../templates/types';
import { DashboardStats } from '@/api/dashboard/dashboard.api';
import { format } from 'date-fns';

interface MonthlyReportTemplateProps {
  stats: DashboardStats;
  settings: CompanySettings;
  period: string; // ex: "Mai 2026"
}

export const MonthlyReportTemplate: React.FC<MonthlyReportTemplateProps> = ({ stats, settings, period }) => {
  const monthlyRevenue = Math.round(Number(stats.monthlyRevenue || 0));
  const unpaidAmount = Math.round(Number(stats.unpaidAmount || 0));
  const conversionRate = Number(stats.conversionRate || 0);

  const hasData = monthlyRevenue > 0 || 
                  (stats.topClients && stats.topClients.length > 0) || 
                  (stats.recentInvoices && stats.recentInvoices.length > 0) ||
                  stats.pendingQuotesCount > 0 ||
                  stats.unpaidInvoicesCount > 0 ||
                  stats.quotesValidatedThisMonth > 0;

  return (
    <div className="flex flex-col min-h-full bg-white text-slate-800 font-sans p-10 max-w-[210mm] mx-auto shadow-sm" id="report-content">
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-6 mb-8 border-slate-200">
        <div className="flex gap-4 items-center">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="Logo" className="h-14 object-contain grayscale opacity-90" />
          )}
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase leading-none mb-1">{settings.companyName}</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{settings.legalForm} {settings.capital && `• ${settings.capital}`}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">RAPPORT D'ACTIVITÉ</h2>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">{period}</p>
        </div>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded bg-slate-50/30">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <circle cx="12" cy="14" r="3"/>
              <path d="M12 17v2"/>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Aucune activité enregistrée</h3>
          <p className="text-xs text-slate-500 text-center max-w-sm px-6">
            Il n'y a pas encore de données pour la période de <span className="font-bold text-slate-700">{period}</span>.
          </p>
        </div>
      ) : (
        <>
          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-px bg-slate-200 border border-slate-200 mb-8 overflow-hidden rounded-sm">
            <div className="bg-white p-5 flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Chiffre d'Affaires HT</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(monthlyRevenue)}</span>
            </div>
            <div className="bg-white p-5 flex flex-col border-l border-slate-200">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Impayé TTC</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(unpaidAmount)}</span>
            </div>
            <div className="bg-white p-5 flex flex-col border-l border-slate-200">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Taux de Conversion</span>
              <span className="text-xl font-black text-slate-900">{conversionRate.toFixed(1)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-8">
            {/* Activity Table */}
            <div>
              <h3 className="text-[10px] font-black mb-3 text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                <span className="w-4 h-px bg-slate-900"></span>
                Indicateurs Clés
              </h3>
              <div className="border border-slate-100 rounded-sm">
                <div className="flex justify-between items-center py-2.5 px-3 border-b border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">Devis en attente</span>
                  <span className="text-xs font-bold text-slate-900">{stats.pendingQuotesCount}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 px-3 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-[11px] text-slate-500 font-medium">Factures en retard</span>
                  <span className="text-xs font-bold text-slate-900">{stats.unpaidInvoicesCount}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 px-3">
                  <span className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">Acceptations</span>
                  <span className="text-xs font-black text-slate-900">{stats.quotesValidatedThisMonth}</span>
                </div>
              </div>
            </div>

            {/* Top Clients */}
            <div>
              <h3 className="text-[10px] font-black mb-3 text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
                <span className="w-4 h-px bg-slate-900"></span>
                Principaux Clients
              </h3>
              <div className="space-y-3">
                {stats.topClients && stats.topClients.length > 0 ? (
                  stats.topClients.slice(0, 4).map((client, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] uppercase tracking-wide">
                        <span className="font-bold text-slate-700 truncate max-w-[150px]">{client.name}</span>
                        <span className="font-bold text-slate-900">{formatCurrency(Number(client.totalAmount))}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-0.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-400" 
                          style={{ 
                            width: `${(Number(client.totalAmount) / Number(stats.topClients![0].totalAmount)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-[10px]">Aucune donnée client</p>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Table */}
          <div className="flex-1">
            <h3 className="text-[10px] font-black mb-3 text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
              <span className="w-4 h-px bg-slate-900"></span>
              Flux de facturation récent
            </h3>
            <div className="border border-slate-200 overflow-hidden rounded-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-400 text-[9px] uppercase font-black tracking-widest">
                    <th className="px-4 py-2 border-r border-slate-200">Référence</th>
                    <th className="px-4 py-2 border-r border-slate-200">Client</th>
                    <th className="px-4 py-2 border-r border-slate-200">Date</th>
                    <th className="px-4 py-2 text-right border-r border-slate-200">Montant TTC</th>
                    <th className="px-4 py-2 text-center">État</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentInvoices && stats.recentInvoices.length > 0 ? (
                    stats.recentInvoices.slice(0, 8).map((invoice, idx) => (
                      <tr key={idx} className="text-[11px]">
                        <td className="px-4 py-2 font-mono font-bold text-slate-900 border-r border-slate-100">{invoice.invoiceNumber}</td>
                        <td className="px-4 py-2 text-slate-700 border-r border-slate-100 truncate max-w-[180px]">
                          {invoice.client?.companyName || `${invoice.client?.firstName} ${invoice.client?.lastName}`}
                        </td>
                        <td className="px-4 py-2 text-slate-500 border-r border-slate-100">
                          {invoice.issueDate ? format(new Date(invoice.issueDate), "dd/MM/yyyy") : "-"}
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-slate-900 border-r border-slate-100">
                          {formatCurrency(Number(invoice.totalTtc))}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded-sm">
                            {invoice.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-400 italic text-xs">Aucune facture enregistrée</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
        <p className="text-slate-400 text-[9px] font-medium uppercase tracking-widest">
          Document confidentiel • FacturArt • {format(new Date(), "dd/MM/yyyy HH:mm")}
        </p>
        <p className="text-slate-300 text-[8px] italic">
          Généré pour {settings.companyName}
        </p>
      </div>
    </div>
  );
};
