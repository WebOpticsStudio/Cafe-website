/**
 * Grants (or revokes) the `admin` custom claim for an existing Firebase Auth user.
 *
 *   npm run set-admin -- owner@example.com
 *   npm run set-admin -- owner@example.com --revoke
 *
 * Create the user first in Firebase console → Authentication → Users. The user must sign
 * out and back in for the claim to appear in their token.
 */
import { getAdminAuth, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

async function main() {
  const email = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
  const revoke = process.argv.includes('--revoke');

  if (!email) throw new Error('Usage: npm run set-admin -- <email> [--revoke]');
  if (!isFirebaseAdminConfigured()) {
    throw new Error('Firebase Admin is not configured. See README → Firebase setup.');
  }

  const auth = getAdminAuth();
  const user = await auth.getUserByEmail(email);
  const claims = { ...(user.customClaims ?? {}) };

  if (revoke) delete claims.admin;
  else claims.admin = true;

  await auth.setCustomUserClaims(user.uid, claims);
  console.log(`✓ ${revoke ? 'Revoked' : 'Granted'} admin for ${email}. They must sign in again.`);
}

main().catch((error) => {
  console.error('✗ Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
