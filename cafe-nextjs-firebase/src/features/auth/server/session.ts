import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminAuth, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { ADMIN_LOGIN_PATH, SESSION_COOKIE_NAME } from '../constants';

export interface SessionUser {
  uid: string;
  email: string | undefined;
  isAdmin: boolean;
}

/**
 * Verifies the session cookie with the Admin SDK (signature, expiry AND revocation).
 * This – not the proxy – is the real authentication check.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  if (!isFirebaseAdminConfigured()) return null;

  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(token, true);
    return { uid: decoded.uid, email: decoded.email, isAdmin: decoded.admin === true };
  } catch {
    return null;
  }
});

/**
 * Call at the top of every admin Server Component and every Server Action that
 * mutates data. Redirects to the login page unless the user is a verified admin.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || !user.isAdmin) redirect(ADMIN_LOGIN_PATH);
  return user;
}
