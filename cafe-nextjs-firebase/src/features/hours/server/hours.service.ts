import 'server-only';
import { cache } from 'react';
import { defaultOpeningHours } from '@/data/seed/hours';
import { COLLECTIONS, SETTINGS_DOCS } from '@/lib/firebase/collections';
import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { withTimeout } from '@/lib/utils/async';
import { logger } from '@/lib/utils/logger';
import { openingHoursSchema, type OpeningHours } from '@/schemas/hours';

/**
 * Opening hours from Firestore (`settings/hours`), validated with Zod.
 * Falls back to the seeded defaults when Firestore is unavailable or the document is
 * missing/invalid – the website never shows broken or empty hours.
 */
export const getOpeningHours = cache(async (): Promise<OpeningHours> => {
  if (!isFirebaseAdminConfigured()) return defaultOpeningHours;

  try {
    const snapshot = await withTimeout(
      getAdminDb().collection(COLLECTIONS.settings).doc(SETTINGS_DOCS.hours).get(),
      8_000,
      'Firestore hours fetch',
    );
    if (!snapshot.exists) return defaultOpeningHours;

    const parsed = openingHoursSchema.safeParse(snapshot.data());
    if (parsed.success) return parsed.data;

    logger.warn('settings/hours is invalid; using defaults', {
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
    });
  } catch (error) {
    logger.error('Could not load opening hours; using defaults', error);
  }
  return defaultOpeningHours;
});
