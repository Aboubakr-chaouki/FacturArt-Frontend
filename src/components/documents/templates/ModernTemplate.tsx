import React from 'react';
import { TemplateProps } from './types';
import { formatCurrency, formatDate } from './utils';
import { LegalFooter } from './LegalFooter';

export const ModernTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  return (
    <div className="flex flex-col min-h-full bg-white text-slate-900 font-sans max-w-[210mm] mx-auto">
      {/* Top Bar Accent */}
      <div className="h-1.5 w-full bg-slate-900"></div>
      
      <div className="flex-1 p-10 bg-slate-50/30">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-6">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain grayscale opacity-80" />
            ) : (
              <div className="text-xl font-black tracking-tighter text-slate-900">
                {settings.companyName.toUpperCase()}
              </div>
            )}
            <div className="text-[10px] space-y-1 text-slate-500">
              <p className="font-bold text-slate-900 text-xs">{settings.companyName}</p>
              <p>{settings.companyAddress}</p>
              <p>{settings.companyEmail}</p>
              <p>{settings.companyPhone}</p>
            </div>
          </div>
          
          <div className="text-right">
            <h1 className="text-4xl font-black tracking-tighter text-slate-200 leading-none mb-2">
              {data.type === 'INVOICE' ? 'FACTURE' : 'DEVIS'}
            </h1>
            <div className="space-y-1">
              <p className="text-lg font-black text-slate-900 leading-none">#{data.number}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Émis le {formatDate(data.issueDate)}</p>
              {data.dueDate && <p className="text-[10px] font-bold text-slate-900 uppercase">Échéance : {formatDate(data.dueDate)}</p>}
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-12 flex justify-end">
          <div className="w-1/2 p-6 rounded-sm border border-slate-100 bg-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full bg-slate-50"></div>
            <h3 className="text-[8px] font-black uppercase mb-3 tracking-[0.2em] text-slate-400 relative z-10">Client</h3>
            <p className="text-base font-black mb-1 relative z-10 text-slate-900">{data.client.company || data.client.name}</p>
            <div className="text-[11px] text-slate-500 space-y-1 relative z-10">
              {data.client.company && <p className="font-medium italic">{data.client.name}</p>}
              <p className="whitespace-pre-line leading-relaxed">{data.client.address}</p>
              <p className="text-slate-400">{data.client.email}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-10">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200">
                <th className="pb-4 pl-2">Désignation</th>
                <th className="pb-4 text-center w-20">Qté</th>
                <th className="pb-4 text-right w-32">P.U. HT</th>
                <th className="pb-4 text-right pr-2 w-32">Total HT</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {data.items.map((item, i: number) => (
                <tr key={i} className="group transition-colors hover:bg-white">
                  <td className="py-4 pl-2 border-b border-slate-50">
                    <p className="font-bold text-slate-800">{item.description}</p>
                    {item.unit && <p className="text-[9px] text-slate-400 font-medium">{item.unit}</p>}
                  </td>
                  <td className="py-4 text-center border-b border-slate-50 font-medium text-slate-500">{item.quantity}</td>
                  <td className="py-4 text-right border-b border-slate-50 font-medium text-slate-500">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-right pr-2 border-b border-slate-50 font-black text-slate-900">{formatCurrency(item.totalHt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-7 space-y-6">
            {data.notes && (
              <div className="p-4 bg-white/50 rounded-sm border border-slate-100 text-[10px] text-slate-500 leading-relaxed italic">
                {data.notes}
              </div>
            )}
          </div>
          
          <div className="col-span-5 space-y-3 bg-slate-900 p-6 rounded-sm text-white shadow-xl">
            <div className="flex justify-between text-[10px] uppercase tracking-wider opacity-60">
              <span>Total HT</span>
              <span className="font-bold">{formatCurrency(data.totalHt)}</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider opacity-60">
              <span>TVA</span>
              <span>{formatCurrency(data.totalTva)}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-white/10 flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total TTC</span>
              <span className="text-2xl font-black">{formatCurrency(data.totalTtc)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 pb-6 opacity-40">
        <LegalFooter settings={settings} />
      </div>
    </div>
  );
};
