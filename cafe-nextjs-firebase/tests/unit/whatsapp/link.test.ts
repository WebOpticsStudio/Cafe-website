import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl, normalizeWhatsAppNumber } from '@/features/whatsapp/lib/link';
import { renderTemplate } from '@/features/whatsapp/lib/messages';

describe('normalizeWhatsAppNumber', () => {
  it.each([
    ['+1 (555) 123-4567', '15551234567'],
    ['0044 20 7946 0958', '442079460958'],
    ['15551234567', '15551234567'],
  ])('normalises %s', (input, expected) => {
    expect(normalizeWhatsAppNumber(input)).toBe(expected);
  });

  it.each(['', 'abc', '12345', '0123456789', '+1 555 123 4567 8901 2345'])(
    'rejects %j',
    (input) => {
      expect(normalizeWhatsAppNumber(input)).toBeNull();
    },
  );
});

describe('buildWhatsAppUrl', () => {
  it('builds a wa.me link with an encoded prefilled message', () => {
    expect(buildWhatsAppUrl('+1 555 123 4567', 'Hi & hello! Table for 2?')).toBe(
      'https://wa.me/15551234567?text=Hi%20%26%20hello!%20Table%20for%202%3F',
    );
  });

  it('omits ?text when the message is empty', () => {
    expect(buildWhatsAppUrl('15551234567', '   ')).toBe('https://wa.me/15551234567');
  });

  it('returns null for an invalid number so callers can hide the button', () => {
    expect(buildWhatsAppUrl('nope', 'hi')).toBeNull();
  });
});

describe('renderTemplate', () => {
  it('fills known tokens and drops unknown ones', () => {
    expect(renderTemplate('Hi {cafe}!{missing}', { cafe: 'Kettle' })).toBe('Hi Kettle!');
  });
});
