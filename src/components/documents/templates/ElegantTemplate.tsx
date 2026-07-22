import React from 'react';
import { TemplateProps } from './types';
import { formatCurrency, formatDate } from './utils';
import { LegalFooter } from './LegalFooter';

export const ElegantTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  return (
    <div className="flex flex-col min-h-full bg-white text-stone-900 font-serif p-12 max-w-[210mm] mx-auto shadow-sm">
      <div className="flex flex-col items-center mb-12 space-y-3 border-b border-stone-100 pb-10">
        {settings.logoUrl && (
          <img src={settings.logoUrl} alt="Logo" className="h-10 mb-2 grayscale opacity-60" />
        )}
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase text-stone-800">
          {settings.companyName}
        </h1>
        <p className="text-[9px] tracking-[0.4em] uppercase text-stone-400 font-sans">
          {settings.legalForm} {settings.capital && `• ${settings.capital}`}
        </p>
      </div>

      <div className="flex justify-between items-start mb-16 px-6">
        <div className="font-sans space-y-3">
          <p className="text-[8px] font-bold uppercase tracking-widest text-stone-300">Destinataire</p>
          <div className="space-y-1">
            <p className="text-lg italic font-serif text-stone-800 leading-none">{data.client.company || data.client.name}</p>
            {data.client.company && <p className="text-xs font-medium text-stone-500 italic">{data.client.name}</p>}
            <p className="text-[11px] text-stone-400 w-56 leading-relaxed whitespace-pre-line">{data.client.address}</p>
          </div>
        </div>
        
        <div className="text-right font-sans space-y-3">
          <h2 className="text-2xl font-light text-stone-200 italic serif leading-none uppercase tracking-widest">{data.type === 'INVOICE' ? 'Facture' : 'Devis'}</h2>
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-widest text-stone-800">#{data.number}</p>
            <p className="text-[10px] text-stone-400 tracking-wider italic uppercase">{formatDate(data.issueDate)}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 mb-12 px-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-left text-[8px] font-sans font-black uppercase tracking-[0.3em] text-stone-400">
              <th className="pb-3 italic">Désignation</th>
              <th className="pb-3 text-center w-20">Qté</th>
              <th className="pb-3 text-right w-32">Montant</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i: number) => (
              <tr key={i} className="border-b border-stone-50 group">
                <td className="py-6 pr-10">
                  <p className="text-base text-stone-800 italic leading-tight mb-1">{item.description}</p>
                  <p className="text-[8px] font-sans text-stone-300 uppercase tracking-widest font-bold">Service Expert</p>
                </td>
                <td className="py-6 text-center font-sans text-stone-500 text-xs">{item.quantity}</td>
                <td className="py-6 text-right font-serif text-stone-800 text-base italic">{formatCurrency(item.totalHt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-end mb-16 px-6">
        <div className="w-64 space-y-3 font-sans border-t-2 border-stone-900 pt-6">
          <div className="flex justify-between text-[9px] tracking-widest text-stone-400 uppercase">
            <span>Total HT</span>
            <span>{formatCurrency(data.totalHt)}</span>
          </div>
          <div className="flex justify-between text-[9px] tracking-widest text-stone-400 uppercase">
            <span>Taxe TVA</span>
            <span>{formatCurrency(data.totalTva)}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-800">Total Net</span>
            <span className="text-3xl font-serif italic text-stone-900">{formatCurrency(data.totalTtc)}</span>
          </div>
        </div>
      </div>

      <div className="opacity-30 font-sans px-6">
        <LegalFooter settings={settings} />
      </div>
    </div>
  );
};
