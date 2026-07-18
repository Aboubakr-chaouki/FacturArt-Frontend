import React from 'react';
import { TemplateProps } from './types';
import { formatCurrency, formatDate } from './utils';
import { LegalFooter } from './LegalFooter';

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  return (
    <div className="flex flex-col min-h-full bg-white text-slate-900 font-sans overflow-hidden max-w-[210mm] mx-auto shadow-sm">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-full -mr-16 skew-x-6 z-0 bg-slate-50"></div>

      <div className="relative z-10 p-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-12">
          <div className="p-6 bg-white border border-slate-100 rounded-sm flex flex-col items-center gap-3">
            {settings.logoUrl && (
              <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain grayscale opacity-60" />
            )}
            <div className="text-center">
              <p className="text-xs font-black tracking-tight text-slate-900">{settings.companyName}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{settings.legalForm}</p>
            </div>
          </div>

          <div className="text-right pt-4">
            <h1 className="text-5xl font-black tracking-tighter text-slate-100 leading-none">
              {data.type === 'INVOICE' ? 'FACTURE' : 'DEVIS'}
            </h1>
            <p className="text-lg font-black mt-[-15px] pr-1 text-slate-900 leading-none uppercase tracking-tight">N° {data.number}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{formatDate(data.issueDate)}</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10 mb-10">
          <div className="col-span-4 space-y-6">
            <div className="p-5 bg-white rounded-sm border border-slate-100 border-l-4 border-l-slate-200">
              <h3 className="text-[8px] font-black uppercase mb-3 tracking-widest text-slate-300">Expéditeur</h3>
              <p className="font-bold text-slate-800 text-xs mb-1">{settings.companyName}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">{settings.companyAddress}</p>
            </div>
            <div className="p-5 bg-white rounded-sm border border-slate-100 border-l-4 border-l-slate-900">
              <h3 className="text-[8px] font-black uppercase mb-3 tracking-widest text-slate-300">Client</h3>
              <p className="font-black text-slate-800 text-sm mb-1">{data.client.company || data.client.name}</p>
              <p className="text-[11px] text-slate-500 leading-relaxed whitespace-pre-line">{data.client.address}</p>
            </div>
          </div>

          <div className="col-span-8 bg-slate-50/50 rounded-sm border border-slate-100 p-6 flex flex-col">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[8px] font-black uppercase tracking-widest text-slate-300 border-b border-slate-100">
                  <th className="pb-4">Désignation</th>
                  <th className="pb-4 text-center w-16">Qté</th>
                  <th className="pb-4 text-right w-24">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 text-[11px]">
                {data.items.map((item, i: number) => (
                  <tr key={i}>
                    <td className="py-4">
                      <p className="font-bold text-slate-800 leading-tight">{item.description}</p>
                    </td>
                    <td className="py-4 text-center font-bold text-slate-400">x{item.quantity}</td>
                    <td className="py-4 text-right font-black text-slate-900">{formatCurrency(item.totalHt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-auto pt-6 border-t border-slate-100 grid grid-cols-2 gap-6 items-end">
              <div className="text-[9px] text-slate-400 leading-relaxed italic uppercase tracking-tighter">
                {data.notes || "Expertise et conseil au service de votre projet."}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <span>S.Total HT</span>
                  <span className="text-slate-600">{formatCurrency(data.totalHt)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-slate-900 border-t border-slate-900 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest self-center">Total</span>
                  <span>{formatCurrency(data.totalTtc)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto opacity-30">
          <LegalFooter settings={settings} />
        </div>
      </div>
    </div>
  );
};
