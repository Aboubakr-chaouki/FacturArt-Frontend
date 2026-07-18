import React from 'react';
import { TemplateProps } from './types';
import { formatCurrency, formatDate } from './utils';
import { LegalFooter } from './LegalFooter';

// Simple, professionnel, adapté aux artisans. Design discret, utilise --primary-color et --secondary-color CSS variables
export const ProArtisanTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  return (
    <div className="flex flex-col min-h-full bg-white text-slate-900 font-sans p-10 max-w-[210mm] mx-auto shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-5">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto object-contain grayscale opacity-60" />
          )}
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none mb-1">{settings.companyName}</h1>
            {settings.companyAddress && <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{settings.companyAddress}</p>}
          </div>
        </div>

        <div className="text-right">
          <div className="inline-block px-3 py-1.5 bg-slate-900 text-white rounded-sm">
            <div className="text-[9px] uppercase tracking-widest font-black leading-none mb-1">{data.type === 'INVOICE' ? 'FACTURE' : 'DEVIS'}</div>
            <div className="text-xs font-bold leading-none">N° {data.number}</div>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            <div>{formatDate(data.issueDate)}</div>
          </div>
        </div>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 border border-slate-100 overflow-hidden rounded-sm mb-8 text-[10px]">
        <div className="bg-white p-5">
          <div className="text-[8px] uppercase font-black text-slate-300 tracking-[0.2em] mb-2">Émetteur</div>
          <div className="font-bold text-xs text-slate-900">{settings.companyName}</div>
          {settings.companyPhone && <div className="text-slate-500 mt-1">Tél : {settings.companyPhone}</div>}
          {settings.companyEmail && <div className="text-slate-500">{settings.companyEmail}</div>}
        </div>

        <div className="bg-white p-5 border-l border-slate-100">
          <div className="text-[8px] uppercase font-black text-slate-300 tracking-[0.2em] mb-2">Destinataire</div>
          <div className="font-bold text-xs text-slate-900">{data.client.company || data.client.name}</div>
          {data.client.address && <div className="text-slate-500 mt-1 whitespace-pre-line leading-relaxed">{data.client.address}</div>}
          {data.client.email && <div className="text-slate-400 mt-1 italic">{data.client.email}</div>}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[8px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-200">
              <th className="py-3 pl-2">Désignation</th>
              <th className="py-3 text-center w-20">Qté</th>
              <th className="py-3 text-right w-32">P.U. HT</th>
              <th className="py-3 text-center w-16">TVA</th>
              <th className="py-3 text-right pr-2 w-32">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[11px]">
            {data.items.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                <td className="py-3 pl-2 align-top">
                  <div className="font-bold text-slate-800 leading-tight">{item.description}</div>
                  {item.unit && <div className="text-[9px] text-slate-400 font-medium">{item.unit}</div>}
                </td>
                <td className="py-3 text-center text-slate-500">{item.quantity}</td>
                <td className="py-3 text-right text-slate-500">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-center text-slate-300">{item.tvaRate}%</td>
                <td className="py-3 text-right pr-2 font-black text-slate-900">{formatCurrency(item.totalHt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end items-end mb-8">
        <div className="w-64 space-y-1.5">
          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <span>S.Total HT</span>
            <span>{formatCurrency(data.totalHt)}</span>
          </div>
          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            <span>TVA</span>
            <span>{formatCurrency(data.totalTva)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-slate-900 text-white rounded-sm mt-2 shadow-xl">
            <span className="text-[10px] font-black uppercase tracking-widest">Total TTC</span>
            <span className="text-xl font-black">{formatCurrency(data.totalTtc)}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto opacity-30">
        <LegalFooter settings={settings} />
      </div>
    </div>
  );
};

