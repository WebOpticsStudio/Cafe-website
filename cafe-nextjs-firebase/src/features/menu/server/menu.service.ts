import 'server-only';
import { cache } from 'react';
import { seedCategories, seedItems } from '@/data/seed/menu';
import { isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { withTimeout } from '@/lib/utils/async';
import { logger } from '@/lib/utils/logger';
import type { MenuData } from '@/types';
import { buildMenu } from '../lib/build-menu';
import { fetchMenu } from './menu.repository';

/**
 * Menu data for pages. Order of preference:
 *   1. Firestore (when the Admin SDK is configured and returns at least one item)
 *   2. Built-in seed data
 *
 * `cache()` de-duplicates calls within one render pass; page-level `revalidate`
 * (see the route files) controls how often Firestore is re-read.
 */
export const getMenu = cache(async (): Promise<MenuData> => {
  if (isFirebaseAdminConfigured()) {
    try {
      const data = await withTimeout(fetchMenu(), 8_000, 'Firestore menu fetch');
      if (data.categories.length > 0 && data.items.length > 0) {
        return buildMenu(data, 'firestore');
      }
      logger.warn('Firestore menu is empty; showing seed data. Run `npm run seed` to populate it.');
    } catch (error) {
      logger.error('Could not load the menu from Firestore; showing seed data', error);
    }
  }
  return buildMenu({ categories: seedCategories, items: seedItems }, 'seed');
});
