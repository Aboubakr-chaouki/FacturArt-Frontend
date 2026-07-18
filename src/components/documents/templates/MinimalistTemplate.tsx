import React from 'react';
import { TemplateProps } from './types';
import { formatCurrency, formatDate } from './utils';
import { LegalFooter } from './LegalFooter';

export const MinimalistTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  return (
    <div className="flex flex-col min-h-full bg-white text-slate-900 font-sans p-12 max-w-[210mm] mx-auto">
      <div className="flex justify-between items-baseline mb-16 border-b pb-8 border-slate-100">
        <h1 className="text-2xl font-light tracking-tighter italic text-slate-800">
          {data.type === 'INVOICE' ? 'Facture' : 'Devis'} 
          <span className="ml-3 text-xs not-italic font-bold text-slate-300 tracking-widest">/{data.number}</span>
        </h1>
        <div className="text-right">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="Logo" className="h-8 ml-auto mb-3 grayscale opacity-70" />
          )}
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">{settings.companyName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-16 mb-16 text-[10px]">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-[8px] font-bold uppercase text-slate-300 tracking-[0.2em] mb-1">Émetteur</p>
            <p className="font-bold text-slate-900 text-xs">{settings.companyName}</p>
            <p className="text-slate-500 leading-relaxed">{settings.companyAddress}</p>
            <p className="text-slate-400 font-medium">{settings.companyEmail}</p>
          </div>
          <div className="pt-4 space-y-1">
            <p className="text-[8px] font-bold uppercase text-slate-300 tracking-[0.2em] mb-1">Chronologie</p>
            <p><span className="text-slate-400 uppercase text-[8px] tracking-wider mr-2">Émission</span> <span className="font-bold">{formatDate(data.issueDate)}</span></p>
            <p><span className="text-slate-400 uppercase text-[8px] tracking-wider mr-2">Échéance</span> <span className="font-bold">{formatDate(data.dueDate || data.validityDate)}</span></p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[8px] font-bold uppercase text-slate-300 tracking-[0.2em] mb-1">Destinataire</p>
          <p className="text-sm font-bold text-slate-900">{data.client.company || data.client.name}</p>
          {data.client.company && <p className="font-medium text-slate-500 italic mb-1">{data.client.name}</p>}
          <p className="text-slate-500 whitespace-pre-line leading-relaxed">{data.client.address}</p>
          <p className="text-slate-400">{data.client.email}</p>
        </div>
      </div>

      <div className="flex-1 mb-16">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-900 text-left text-[8px] font-black uppercase tracking-[0.25em] text-slate-400">
              <th className="pb-3">Désignation</th>
              <th className="pb-3 text-center w-20">Qté</th>
              <th className="pb-3 text-right w-32">P.U. HT</th>
              <th className="pb-3 text-right w-32">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.items.map((item, i: number) => (
              <tr key={i} className="text-[10px]">
                <td className="py-4 pr-8">
                  <p className="font-bold text-slate-800">{item.description}</p>
                </td>
                <td className="py-4 text-center text-slate-500 font-medium">{item.quantity}</td>
                <td className="py-4 text-right text-slate-500">{formatCurrency(item.unitPrice)}</td>
                <td className="py-4 text-right font-bold text-slate-900">{formatCurrency(item.totalHt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-12">
        <div className="w-56 space-y-2">
          <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-400">
            <span>Sous-total</span>
            <span className="font-bold text-slate-600">{formatCurrency(data.totalHt)}</span>
          </div>
          <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-400">
            <span>TVA</span>
            <span className="font-bold text-slate-600">{formatCurrency(data.totalTva)}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total</span>
            <span className="text-2xl font-black text-slate-900">{formatCurrency(data.totalTtc)}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto opacity-40">
         <LegalFooter settings={settings} />
      </div>
    </div>
  );
};
