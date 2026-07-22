import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentRenderer } from './DocumentRenderer';
import { TemplateProps } from './types';

// Mock des composants de template
vi.mock('./ArtisanTemplate', () => ({
  ArtisanTemplate: () => <div data-testid="artisan-template">Artisan Template</div>
}));

vi.mock('./ModernTemplate', () => ({
  ModernTemplate: () => <div data-testid="modern-template">Modern Template</div>
}));

describe('DocumentRenderer', () => {
  const mockProps: TemplateProps = {
    data: {
      type: 'INVOICE',
      number: 'FAC-001',
      issueDate: '2025-01-01',
      status: 'PAID',
      client: { name: 'John Doe' },
      items: [],
      totalHt: 100,
      totalTva: 20,
      totalTtc: 120,
    },
    settings: {
      template: 'artisan',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      companyName: 'My Company',
      companyAddress: '123 Main St',
    }
  };

  it('devrait afficher le template Artisan par défaut', () => {
    render(<DocumentRenderer {...mockProps} />);
    expect(screen.getByTestId('artisan-template')).toBeDefined();
  });

  it('devrait afficher le template Modern quand demandé', () => {
    const modernProps = {
      ...mockProps,
      settings: { ...mockProps.settings, template: 'modern' }
    };
    render(<DocumentRenderer {...modernProps} />);
    expect(screen.getByTestId('modern-template')).toBeDefined();
  });
});
