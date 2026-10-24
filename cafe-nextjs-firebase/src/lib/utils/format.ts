/**
 * Formats an amount in the designated currency.
 * For INR, displays clean rupee amounts with the ₹ symbol without trailing zero decimals (e.g. ₹220).
 * For USD and other currencies, handles standard minor unit decimal formatting (e.g. $4.50).
 */
export function formatPrice(amountMinor: number, currency: string, locale: string): string {
  if (currency === 'INR') {
    // If amount is stored in paise (>= 10000) or directly in rupees
    const rupees = amountMinor >= 10000 ? amountMinor / 100 : amountMinor;
    return new Intl.NumberFormat(locale || 'en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(rupees);
  }

  const formatter = new Intl.NumberFormat(locale, { style: 'currency', currency });
  const digits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
  return formatter.format(amountMinor / 10 ** digits);
}

export function truncate(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= maxLength ? clean : `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}
