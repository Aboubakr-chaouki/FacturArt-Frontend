import React, { useEffect, useState } from 'react';
import { TemplateProps } from './types';
import { ArtisanTemplate } from './ArtisanTemplate';
import { ModernTemplate } from './ModernTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ProArtisanTemplate } from './ProArtisanTemplate';
import { getLogoUrl, fetchImageAsBase64 } from './utils';

export const DocumentRenderer: React.FC<TemplateProps> = (props) => {
  const { settings } = props;
  const [base64Logo, setBase64Logo] = useState<string | undefined>(undefined);

  useEffect(() => {
    const logoUrl = getLogoUrl(settings.logoUrl);
    
    // Si pas de logo, on réinitialise et on arrête
    if (!logoUrl) {
      setBase64Logo(undefined);
      return;
    }

    // Si le logo est déjà en base64 (data:), on le met directement
    if (logoUrl.startsWith('data:')) {
      if (base64Logo !== logoUrl) {
        setBase64Logo(logoUrl);
      }
      return;
    }

    const processLogo = async () => {
      try {
        const base64 = await fetchImageAsBase64(logoUrl);
        setBase64Logo(base64);
      } catch (err) {
        setBase64Logo(logoUrl); // Fallback to original URL
      }
    };
    
    processLogo();
  }, [settings.logoUrl]);

  const processedSettings = {
    ...settings,
    logoUrl: base64Logo
  };

  const finalProps = { ...props, settings: processedSettings };

  switch (settings.template) {
    case 'artisan':
      return <ArtisanTemplate {...finalProps} />;
    case 'modern':
      return <ModernTemplate {...finalProps} />;
    case 'professional':
      return <ProfessionalTemplate {...finalProps} />;
    case 'minimalist':
      return <MinimalistTemplate {...finalProps} />;
    case 'elegant':
      return <ElegantTemplate {...finalProps} />;
    case 'creative':
      return <CreativeTemplate {...finalProps} />;
    case 'pro':
      return <ProArtisanTemplate {...finalProps} />;
    default:
      return <ArtisanTemplate {...finalProps} />;
  }
};
