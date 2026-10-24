import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OpenStatusBadge } from '@/features/hours/components/OpenStatusBadge';
import { OpeningHoursTable } from '@/features/hours/components/OpeningHoursTable';
import { openingHoursSchema } from '@/schemas/hours';

const hours = openingHoursSchema.parse({
  timezone: 'UTC',
  weekly: {
    monday: [{ open: '08:00', close: '17:00' }],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('OpenStatusBadge', () => {
  it('shows "Open now" with the closing time during opening hours', () => {
    vi.useFakeTimers({ now: new Date('2026-03-02T10:00:00Z') }); // Monday
    render(<OpenStatusBadge hours={hours} locale="en-US" />);
    expect(screen.getByText('Open now')).toBeInTheDocument();
    expect(screen.getByText(/Closes at 5:00/)).toBeInTheDocument();
  });

  it('shows "Closed" with the next opening time otherwise', () => {
    vi.useFakeTimers({ now: new Date('2026-03-03T10:00:00Z') }); // Tuesday
    render(<OpenStatusBadge hours={hours} locale="en-US" />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.getByText(/Opens Monday at 8:00/)).toBeInTheDocument();
  });
});

describe('OpeningHoursTable', () => {
  it('renders every weekday and marks today', () => {
    vi.useFakeTimers({ now: new Date('2026-03-02T10:00:00Z') });
    render(<OpeningHoursTable hours={hours} locale="en-US" />);
    expect(screen.getAllByRole('row')).toHaveLength(7);
    expect(screen.getByRole('row', { current: 'date' })).toHaveTextContent('Monday');
  });
});

describe('WhatsAppButton', () => {
  it('renders a safe external link when a number is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '15551234567');
    const { WhatsAppButton } = await import('@/features/whatsapp/components/WhatsAppButton');
    render(<WhatsAppButton />);
    const link = screen.getByRole('link', { name: /Message us on WhatsApp/ });
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/15551234567?text='),
    );
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders nothing when no number is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '');
    const { WhatsAppButton } = await import('@/features/whatsapp/components/WhatsAppButton');
    const { container } = render(<WhatsAppButton />);
    expect(container).toBeEmptyDOMElement();
  });
});
