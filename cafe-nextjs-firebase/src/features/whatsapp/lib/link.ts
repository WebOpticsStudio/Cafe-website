/**
 * Normalises a human-entered phone number to WhatsApp's expected format:
 * international, digits only, no "+" or leading zeros ("+1 (555) 123-4567" → "15551234567").
 * Returns `null` when the result is not a plausible number (8–15 digits).
 */
export function normalizeWhatsAppNumber(input: string): string | null {
  const digits = input
    .trim()
    .replace(/[\s\-().]/g, '')
    .replace(/^\+/, '')
    .replace(/^00/, '');
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}

/** Builds a click-to-chat link: https://wa.me/<number>?text=<message>. */
export function buildWhatsAppUrl(phone: string, message?: string): string | null {
  const number = normalizeWhatsAppNumber(phone);
  if (!number) return null;
  const text = message?.trim();
  return text
    ? `https://wa.me/${number}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${number}`;
}
