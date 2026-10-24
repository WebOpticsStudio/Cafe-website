import { z } from 'zod';
import { publicEnv } from '@/lib/env';
import { phoneDigitsSchema, timeZoneSchema, instagramHandleSchema } from '@/schemas/common';
import { instagramPostSchema } from '@/schemas/instagram';

/**
 * Central, typed, validated site configuration.
 *
 * Business identity lives here (edit the values marked PLACEHOLDER).
 * Deployment-specific integration settings (site URL, WhatsApp number, Maps key,
 * Instagram handle) come from environment variables via `@/lib/env`.
 * Opening hours and the menu live in Firestore (with seed fallbacks in `@/data/seed`).
 */
const siteConfigSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1).max(200),
  url: z.url(),
  locale: z.string().min(2),
  /** ISO 4217 currency code used to format menu prices. */
  currency: z.string().length(3),
  timezone: timeZoneSchema,
  contact: z.object({
    email: z.email(),
    phoneDisplay: z.string().min(1),
    /** Digits with optional leading "+" for `tel:` links. */
    phoneTel: z.string().regex(/^\+?\d{6,15}$/),
  }),
  address: z.object({
    streetAddress: z.string().min(1),
    locality: z.string().min(1),
    region: z.string().min(1),
    postalCode: z.string().min(1),
    /** ISO 3166-1 alpha-2. */
    country: z.string().length(2),
  }),
  geo: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  hero: z.object({ imageSrc: z.string().min(1), imageAlt: z.string().min(1) }),
  maps: z.object({
    embedApiKey: z.string().optional(),
    /** Optional Google Place ID – makes directions links land exactly on your listing. */
    placeId: z.string().optional(),
  }),
  whatsapp: z.object({
    number: phoneDigitsSchema.optional(),
    /** Prefilled message. `{cafe}` is replaced with the cafe name. */
    message: z.string().min(1).max(500),
  }),
  instagram: z.object({
    handle: instagramHandleSchema.optional(),
    /** Hand-picked posts shown when the live API is not configured (optional). */
    curatedPosts: z.array(instagramPostSchema).max(12),
  }),
  nav: z.array(z.object({ label: z.string(), href: z.string().startsWith('/') })).min(1),
});

export const siteConfig = siteConfigSchema.parse({
  // ── Identity ──────────────────────────────────────────────────────────────
  name: 'Brewista',
  tagline: 'Good Coffee, Good Vibes',
  description:
    'We serve freshly brewed coffee, delicious food, and good vibes – every single day.',
  url: (publicEnv.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, ''),

  // ── Regional settings ───────────────────────────────────────────────────────
  locale: 'en-IN',
  currency: 'INR',
  timezone: 'Asia/Kolkata',

  // ── Contact & location ─────────────────────────────────────────────────────
  contact: {
    email: 'hello@brewista.com',
    phoneDisplay: '+91 98765 43210',
    phoneTel: '+919876543210',
  },
  address: {
    streetAddress: '#123, 2nd Main Road, 4th Cross',
    locality: 'Marathahalli',
    region: 'Bengaluru, Karnataka',
    postalCode: '560037',
    country: 'IN',
  },
  geo: { latitude: 12.9591, longitude: 77.6974 },

  // ── Hero ────────────────────────────────────────────────────────────────────
  hero: {
    imageSrc: '/images/hero-coffee.jpg',
    imageAlt: 'Freshly brewed artisan latte art coffee on a wooden cafe table in a sunlit ambient space',
  },

  // ── Integrations ────────────────────────────────────────────────────────────
  maps: {
    embedApiKey: publicEnv.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY,
    placeId: undefined,
  },
  whatsapp: {
    number: publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER || undefined,
    message: publicEnv.NEXT_PUBLIC_WHATSAPP_MESSAGE ?? 'Hi Brewista! I would like to enquire about table reservations and menu specials.',
  },
  instagram: {
    handle: publicEnv.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? 'brewista.cafe',
    curatedPosts: [],
  },

  // ── Navigation ──────────────────────────────────────────────────────────────
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Menu', href: '/menu' },
    { label: 'Specials', href: '/#specials' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact Us', href: '/visit' },
  ],
});

export type SiteConfig = typeof siteConfig;

/** "123 Example Street, Springfield, NY 10001" */
export function formatAddress(address: SiteConfig['address'] = siteConfig.address): string {
  return `${address.streetAddress}, ${address.locality}, ${address.region} ${address.postalCode}`;
}
