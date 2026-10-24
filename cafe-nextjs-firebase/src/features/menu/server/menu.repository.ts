import 'server-only';
import type { z } from 'zod';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { FieldValue, getAdminDb, type QueryDocumentSnapshot } from '@/lib/firebase/admin';
import { logger } from '@/lib/utils/logger';
import {
  menuCategorySchema,
  menuItemSchema,
  type MenuCategory,
  type MenuItem,
} from '@/schemas/menu';

/**
 * Firestore access for the menu (Admin SDK, server only).
 * Every document is validated with Zod; invalid documents are skipped and logged so that one
 * bad record can never take the whole menu page down.
 */

function parseDocs<T>(
  docs: QueryDocumentSnapshot[],
  schema: z.ZodType<T>,
  collection: string,
): T[] {
  const valid: T[] = [];
  for (const doc of docs) {
    const result = schema.safeParse({ id: doc.id, ...doc.data() });
    if (result.success) {
      valid.push(result.data);
    } else {
      logger.warn('Skipping invalid Firestore document', {
        collection,
        id: doc.id,
        issues: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      });
    }
  }
  return valid;
}

/**
 * The menu is small (tens of documents), so both collections are read whole and
 * filtered/grouped in memory. This avoids composite indexes entirely.
 */
export async function fetchMenu(): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> {
  const db = getAdminDb();
  const [categorySnap, itemSnap] = await Promise.all([
    db.collection(COLLECTIONS.menuCategories).orderBy('sortOrder').get(),
    db.collection(COLLECTIONS.menuItems).orderBy('sortOrder').get(),
  ]);

  return {
    categories: parseDocs(categorySnap.docs, menuCategorySchema, COLLECTIONS.menuCategories),
    items: parseDocs(itemSnap.docs, menuItemSchema, COLLECTIONS.menuItems),
  };
}

/** Marks an item available / sold out. Throws if the document does not exist. */
export async function setMenuItemAvailability(itemId: string, isAvailable: boolean): Promise<void> {
  await getAdminDb().collection(COLLECTIONS.menuItems).doc(itemId).update({
    isAvailable,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
