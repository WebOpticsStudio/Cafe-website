import { z } from 'zod';
import { instagramHandleSchema, phoneDigitsSchema } from '@/schemas/common';

/**
 * PUBLIC environment variables (NEXT_PUBLIC_*).
 *
 * These are inlined into the browser bundle at build time – never put secrets here.
 * Next.js only inlines `process.env.NEXT_PUBLIC_X` when it is written literally, which is
 * why every variable is referenced explicitly below instead of spreading `process.env`.
 *
 * Every variable is optional; when unset the related feature uses a safe fallback.
 * Malformed values fail fast with a readable message.
 */

const emptyToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess(emptyToUndefined, schema.optional());

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: optional(z.url()),
  NEXT_PUBLIC_FIREBASE_API_KEY: optional(z.string()),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: optional(z.string()),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: optional(z.string()),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: optional(z.string()),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: optional(z.string()),
  NEXT_PUBLIC_FIREBASE_APP_ID: optional(z.string()),
  NEXT_PUBLIC_USE_FIREBASE_EMULATORS: z.preprocess(
    (value) => (value === 'true' ? true : value === 'false' || value === '' ? false : value),
    z.boolean().optional().default(false),
  ),
  NEXT_PUBLIC_WHATSAPP_NUMBER: optional(phoneDigitsSchema),
  NEXT_PUBLIC_WHATSAPP_MESSAGE: optional(z.string().max(500)),
  NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY: optional(z.string()),
  NEXT_PUBLIC_INSTAGRAM_HANDLE: optional(instagramHandleSchema),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_USE_FIREBASE_EMULATORS: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  NEXT_PUBLIC_WHATSAPP_MESSAGE: process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE,
  NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY,
  NEXT_PUBLIC_INSTAGRAM_HANDLE: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const publicEnv = parsed.data;

/** True when the Firebase *web* config needed for client-side Auth is present. */
export const isFirebaseClientConfigured = Boolean(
  publicEnv.NEXT_PUBLIC_FIREBASE_API_KEY &&
  publicEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  publicEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  publicEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
);
