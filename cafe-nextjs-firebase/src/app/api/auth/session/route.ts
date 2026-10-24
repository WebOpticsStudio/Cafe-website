import { NextResponse } from 'next/server';
import {
  MAX_AUTH_AGE_SECONDS,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/features/auth/constants';
import { getAdminAuth, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { logger } from '@/lib/utils/logger';
import { sessionRequestSchema } from '@/schemas/auth';

const noStore = { 'Cache-Control': 'no-store' };

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: noStore });
}

/** Rejects cross-site requests (CSRF defence in depth on top of SameSite=Lax cookies). */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

/**
 * POST – exchanges a freshly issued Firebase ID token for an HTTP-only session cookie.
 * Only accounts with the `admin` custom claim are accepted.
 */
export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return json({ error: 'Authentication is not configured on the server.' }, 503);
  }
  if (!isSameOrigin(request)) return json({ error: 'Forbidden.' }, 403);

  const body = sessionRequestSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return json({ error: 'Invalid request.' }, 400);

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(body.data.idToken, true);

    if (decoded.admin !== true) {
      return json({ error: 'This account does not have admin access.' }, 403);
    }
    if (Date.now() / 1000 - decoded.auth_time > MAX_AUTH_AGE_SECONDS) {
      return json({ error: 'Please sign in again.' }, 401);
    }

    const sessionCookie = await auth.createSessionCookie(body.data.idToken, {
      expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
    });

    const response = json({ ok: true }, 200);
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionCookie,
      maxAge: SESSION_MAX_AGE_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return response;
  } catch (error) {
    logger.warn('Session creation rejected', {
      reason: error instanceof Error ? error.name : 'unknown',
    });
    return json({ error: 'Invalid or expired credentials.' }, 401);
  }
}

/** DELETE – clears the session cookie. */
export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return json({ error: 'Forbidden.' }, 403);
  const response = json({ ok: true }, 200);
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
