import React from 'react';
import { CompanySettings } from './types';

export const LegalFooter: React.FC<{ settings: CompanySettings }> = ({ settings }) => {
  const parts = [
    settings.companyName,
    settings.legalForm,
    settings.capital && `Capital : ${settings.capital}`,
    settings.siret && `SIRET : ${settings.siret}`,
    settings.rcs && `RCS : ${settings.rcs}`,
    settings.tvaIntra && `TVA Intra. : ${settings.tvaIntra}`,
    settings.companyAddress,
    settings.companyPhone && `Tél : ${settings.companyPhone}`,
    settings.companyEmail && `Email : ${settings.companyEmail}`
  ].filter(Boolean);

  return (
    <div className="mt-auto pt-8 text-[9px] text-slate-400 text-center border-t border-slate-100 uppercase tracking-[0.1em] space-y-2">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 max-w-4xl mx-auto">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span className="font-medium whitespace-nowrap">{part}</span>
            {index < parts.length - 1 && <span className="text-slate-200">•</span>}
          </React.Fragment>
        ))}
      </div>
      {settings.footerText && (
        <div className="mt-3 text-[10px] font-bold text-slate-500 normal-case italic max-w-2xl mx-auto leading-relaxed">
          {settings.footerText}
        </div>
      )}
    </div>
  );
};
