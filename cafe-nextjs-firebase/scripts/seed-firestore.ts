/**
 * Seeds Firestore with the sample menu and opening hours.
 *
 *   npm run seed            – writes only into EMPTY collections (safe to re-run)
 *   npm run seed -- --force – overwrites documents with the same IDs
 *
 * Needs Admin credentials in `.env.local` (or emulator hosts), see README.
 */
import { seedCategories, seedItems } from '@/data/seed/menu';
import { defaultOpeningHours } from '@/data/seed/hours';
import { FieldValue, getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { COLLECTIONS, SETTINGS_DOCS } from '@/lib/firebase/collections';
import { openingHoursSchema } from '@/schemas/hours';

async function main() {
  const force = process.argv.includes('--force');

  if (!isFirebaseAdminConfigured()) {
    throw new Error(
      'Firebase Admin is not configured. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID plus credentials ' +
        '(or emulator hosts) in .env.local.',
    );
  }

  const db = getAdminDb();
  const batch = db.batch();
  let writes = 0;

  const isEmpty = async (name: string) => (await db.collection(name).limit(1).get()).empty;

  if (force || (await isEmpty(COLLECTIONS.menuCategories))) {
    for (const { id, ...data } of seedCategories) {
      batch.set(db.collection(COLLECTIONS.menuCategories).doc(id), {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
      writes += 1;
    }
  } else {
    console.log(
      `• ${COLLECTIONS.menuCategories} is not empty – skipped (use --force to overwrite)`,
    );
  }

  if (force || (await isEmpty(COLLECTIONS.menuItems))) {
    for (const { id, ...data } of seedItems) {
      batch.set(db.collection(COLLECTIONS.menuItems).doc(id), {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });
      writes += 1;
    }
  } else {
    console.log(`• ${COLLECTIONS.menuItems} is not empty – skipped (use --force to overwrite)`);
  }

  const hoursRef = db.collection(COLLECTIONS.settings).doc(SETTINGS_DOCS.hours);
  if (force || !(await hoursRef.get()).exists) {
    batch.set(hoursRef, openingHoursSchema.parse(defaultOpeningHours));
    writes += 1;
  } else {
    console.log(`• ${COLLECTIONS.settings}/${SETTINGS_DOCS.hours} exists – skipped`);
  }

  if (writes > 0) await batch.commit();
  console.log(`✓ Seed complete (${writes} document${writes === 1 ? '' : 's'} written).`);
}

main().catch((error) => {
  console.error('✗ Seed failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
