import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DocumentRenderer } from './DocumentRenderer';

// Mock des composants de template
vi.mock('./ArtisanTemplate', () => ({
  ArtisanTemplate: () => <div data-testid="artisan-template">Artisan Template</div>
}));

vi.mock('./ModernTemplate', () => ({
  ModernTemplate: () => <div data-testid="modern-template">Modern Template</div>
}));

describe('DocumentRenderer', () => {
  const mockProps = {
    data: {
      type: 'invoice',
      number: 'FAC-001',
      date: '2025-01-01',
      client: { firstName: 'John', lastName: 'Doe' },
      items: [],
      totalHT: 100,
      totalTVA: 20,
      totalTTC: 120,
    },
    settings: {
      template: 'artisan',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      companyName: 'My Company',
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
