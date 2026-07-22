import React from 'react';
import { TemplateProps } from './types';
import { formatCurrency, formatDate } from './utils';
import { LegalFooter } from './LegalFooter';

export const ArtisanTemplate: React.FC<TemplateProps> = ({ data, settings }) => {
  return (
    <div className="flex flex-col min-h-full p-10 bg-white text-slate-800 font-sans border-[4px] border-slate-900 max-w-[210mm] mx-auto shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-4">
          {settings.logoUrl && (
            <img src={settings.logoUrl} alt="Logo" className="h-14 object-contain grayscale opacity-70" />
          )}
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-slate-900 leading-none mb-1">
              {settings.companyName}
            </h1>
            <p className="font-bold text-[10px] uppercase text-slate-400 tracking-widest">{settings.legalForm}</p>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="inline-block px-4 py-2 border-2 border-slate-900">
            <h2 className="text-lg font-black uppercase italic text-slate-900">
              {data.type === 'INVOICE' ? 'Facture' : 'Devis'}
            </h2>
          </div>
          <p className="font-black text-sm uppercase tracking-tighter">N° {data.number}</p>
          <div className="text-[10px] space-y-0.5 font-medium">
            <p><span className="text-slate-400 uppercase text-[8px] tracking-wider mr-1">Émis :</span> {formatDate(data.issueDate)}</p>
            {data.dueDate && <p><span className="text-slate-400 uppercase text-[8px] tracking-wider mr-1">Échéance :</span> {formatDate(data.dueDate)}</p>}
            {data.validityDate && <p><span className="text-slate-400 uppercase text-[8px] tracking-wider mr-1">Validité :</span> {formatDate(data.validityDate)}</p>}
          </div>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-2 gap-10 mb-10">
        <div className="p-4 bg-slate-50 border-l-2 border-slate-200">
          <h3 className="text-[8px] font-black uppercase mb-2 tracking-widest text-slate-400">Émetteur</h3>
          <p className="font-bold text-xs mb-1 text-slate-900">{settings.companyName}</p>
          <p className="text-[11px] text-slate-500 leading-relaxed whitespace-pre-line">{settings.companyAddress}</p>
          {(settings.companyPhone || settings.companyEmail) && (
            <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] space-y-0.5 text-slate-400">
              {settings.companyPhone && <p><span className="font-bold opacity-50 uppercase text-[8px]">Tél :</span> {settings.companyPhone}</p>}
              {settings.companyEmail && <p><span className="font-bold opacity-50 uppercase text-[8px]">Email :</span> {settings.companyEmail}</p>}
            </div>
          )}
        </div>
        <div className="p-4 bg-slate-50 border-l-2 border-slate-900">
          <h3 className="text-[8px] font-black uppercase mb-2 tracking-widest text-slate-400">Destinataire</h3>
          <p className="font-bold text-xs mb-1 text-slate-900">{data.client.company || data.client.name}</p>
          {data.client.company && data.client.name && <p className="text-[10px] mb-1 font-medium italic">{data.client.name}</p>}
          <p className="text-[11px] text-slate-500 leading-relaxed whitespace-pre-line">{data.client.address}</p>
          {(data.client.phone || data.client.email) && (
            <div className="mt-3 pt-3 border-t border-slate-200 text-[10px] space-y-0.5 text-slate-400">
              {data.client.phone && <p><span className="font-bold opacity-50 uppercase text-[8px]">Tél :</span> {data.client.phone}</p>}
              {data.client.email && <p><span className="font-bold opacity-50 uppercase text-[8px]">Email :</span> {data.client.email}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 mb-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white uppercase text-[8px] tracking-[0.25em]">
              <th className="px-5 py-3 text-left">Désignation</th>
              <th className="px-5 py-3 text-center w-16">Qté</th>
              <th className="px-5 py-3 text-right w-24">P.U. HT</th>
              <th className="px-5 py-3 text-center w-16">TVA</th>
              <th className="px-5 py-3 text-right w-24">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 border-x border-slate-100">
            {data.items.map((item, i: number) => (
              <tr key={i} className={`text-[11px] ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                <td className="px-5 py-3">
                  <p className="font-bold text-slate-800">{item.description}</p>
                  {item.unit && <p className="text-[9px] text-slate-400 font-medium">{item.unit}</p>}
                </td>
                <td className="px-5 py-3 text-center font-medium">{item.quantity}</td>
                <td className="px-5 py-3 text-right font-medium">{formatCurrency(item.unitPrice)}</td>
                <td className="px-5 py-3 text-center font-medium text-slate-300">{item.tvaRate}%</td>
                <td className="px-5 py-3 text-right font-black text-slate-900">{formatCurrency(item.totalHt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-between items-start">
        <div className="max-w-[45%] text-[10px] italic text-slate-400 bg-slate-50/50 p-4 rounded-sm border border-slate-100">
          {data.notes && <p className="mb-3 whitespace-pre-line not-italic font-medium text-slate-500 leading-relaxed">{data.notes}</p>}
          <p className="text-[8px] uppercase font-black text-slate-300 mb-1 tracking-widest">Mentions légales</p>
          <p className="text-[8px] leading-tight opacity-70">En cas de retard de paiement, une indemnité forfaitaire de 40€ pour frais de recouvrement sera exigée. Pas d'escompte pour paiement anticipé.</p>
        </div>
        <div className="w-64 space-y-1">
          <div className="flex justify-between px-4 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            <span>Total HT</span>
            <span>{formatCurrency(data.totalHt)}</span>
          </div>
          <div className="flex justify-between px-4 py-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50/50">
            <span>TVA</span>
            <span>{formatCurrency(data.totalTva)}</span>
          </div>
          <div className="flex justify-between px-4 py-3 bg-slate-900 text-white rounded-sm mt-2 shadow-lg">
            <span className="font-black uppercase tracking-widest text-[10px] self-center">Net à payer</span>
            <span className="text-xl font-black">{formatCurrency(data.totalTtc)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 opacity-40">
        <LegalFooter settings={settings} />
      </div>
    </div>
  );
};
