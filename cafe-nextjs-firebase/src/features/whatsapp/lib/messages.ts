import { siteConfig } from '@/config/site';
import { buildWhatsAppUrl } from './link';

/** Replaces `{name}` tokens; unknown tokens are removed. */
export function renderTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '').trim();
}

/** Ready-made message templates. Add more here as the business grows (catering, events…). */
export const whatsappTemplates = {
  general: siteConfig.whatsapp.message,
  groupBooking: 'Hi {cafe}! I would like to ask about a table for a group. Is there space?',
} as const;

export type WhatsAppTemplateKey = keyof typeof whatsappTemplates;

/**
 * Returns the cafe's WhatsApp link for a template, or `null` when no number is configured
 * (callers hide the button – there is never a dead link).
 */
export function getWhatsAppHref(template: WhatsAppTemplateKey = 'general'): string | null {
  const { number } = siteConfig.whatsapp;
  if (!number) return null;
  const message = renderTemplate(whatsappTemplates[template], { cafe: siteConfig.name });
  return buildWhatsAppUrl(number, message);
}
