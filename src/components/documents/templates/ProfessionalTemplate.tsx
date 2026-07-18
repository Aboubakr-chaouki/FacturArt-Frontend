import React from 'react';
import { TemplateProps } from './types';
import { formatCurrency, formatDate } from './utils';
import { LegalFooter } from './LegalFooter';

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  return (
    <div className="flex flex-col min-h-full bg-white text-slate-800 font-sans max-w-[210mm] mx-auto">
      {/* Black Header Section */}
      <div className="bg-slate-900 text-white p-10 flex justify-between items-center">
        <div className="flex gap-6 items-center">
          {settings.logoUrl && (
            <div className="bg-white p-3 rounded-sm">
              <img src={settings.logoUrl} alt="Logo" className="h-12 object-contain grayscale" />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase leading-none mb-1">{settings.companyName}</h1>
            <p className="text-white/60 text-[10px] font-medium uppercase tracking-wider">{settings.legalForm} {settings.capital && `• ${settings.capital}`}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black tracking-tighter leading-none mb-1">{data.type === 'INVOICE' ? 'FACTURE' : 'DEVIS'}</h2>
          <p className="text-sm font-light opacity-60 uppercase tracking-widest">N° {data.number}</p>
        </div>
      </div>

      <div className="p-10 flex-1">
        {/* Contact info grid */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <div>
              <h3 className="text-[9px] font-bold uppercase text-slate-400 mb-2 border-b pb-1 tracking-widest">Émetteur</h3>
              <p className="text-xs font-bold text-slate-900">{settings.companyName}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{settings.companyAddress}</p>
              <div className="mt-2 text-[10px] text-slate-400 font-medium">
                {settings.companyEmail && <p>Email: {settings.companyEmail}</p>}
                {settings.companyPhone && <p>Tél: {settings.companyPhone}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 overflow-hidden rounded-sm">
              <div className="bg-slate-50/50 p-3">
                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter mb-1">Date d'émission</p>
                <p className="text-xs font-bold text-slate-900">{formatDate(data.issueDate)}</p>
              </div>
              <div className="bg-slate-50/50 p-3 border-l border-slate-100">
                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter mb-1">{data.type === 'INVOICE' ? 'Échéance' : 'Validité'}</p>
                <p className="text-xs font-bold text-slate-900">{formatDate(data.dueDate || data.validityDate)}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[9px] font-bold uppercase text-slate-400 mb-2 border-b pb-1 tracking-widest">Destinataire</h3>
            <div className="p-5 rounded-sm border border-slate-100 bg-slate-50/30">
              <p className="text-sm font-bold text-slate-900 mb-1">{data.client.company || data.client.name}</p>
              <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">{data.client.address}</p>
              {data.client.company && data.client.name && (
                <p className="mt-3 text-[10px] font-medium text-slate-400 italic">À l'attention de : {data.client.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-sm overflow-hidden mb-10">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <th className="px-5 py-3 border-r border-slate-200">Description</th>
                <th className="px-5 py-3 text-center border-r border-slate-200">Qté</th>
                <th className="px-5 py-3 text-right border-r border-slate-200">PU HT</th>
                <th className="px-5 py-3 text-center border-r border-slate-200">TVA</th>
                <th className="px-5 py-3 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((item, i: number) => (
                <tr key={i} className="text-[11px] text-slate-700">
                  <td className="px-5 py-3 border-r border-slate-100 font-medium">
                    {item.description}
                  </td>
                  <td className="px-5 py-3 text-center border-r border-slate-100">{item.quantity}</td>
                  <td className="px-5 py-3 text-right border-r border-slate-100">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-5 py-3 text-center text-slate-400 border-r border-slate-100">{item.tvaRate}%</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-900">{formatCurrency(item.totalHt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes & Totals */}
        <div className="flex justify-between gap-10">
          <div className="flex-1">
            {data.notes && (
              <div className="space-y-2">
                <h4 className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Notes & Conditions</h4>
                <div className="text-[10px] text-slate-500 bg-slate-50/50 p-4 rounded-sm border border-slate-100 border-l-2 border-l-slate-900">
                  {data.notes}
                </div>
              </div>
            )}
          </div>
          <div className="w-64">
            <div className="border border-slate-200 rounded-sm overflow-hidden">
              <div className="p-3 space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span className="uppercase tracking-tight">Total Hors Taxes</span>
                  <span className="font-bold">{formatCurrency(data.totalHt)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span className="uppercase tracking-tight">Total TVA</span>
                  <span className="font-bold">{formatCurrency(data.totalTva)}</span>
                </div>
              </div>
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Net à payer</span>
                <span className="text-xl font-black">{formatCurrency(data.totalTtc)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 pb-6 opacity-60">
        <LegalFooter settings={settings} />
      </div>
    </div>
  );
};
