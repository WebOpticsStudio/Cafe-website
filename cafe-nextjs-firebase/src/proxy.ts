import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_LOGIN_PATH, SESSION_COOKIE_NAME } from '@/features/auth/constants';

/**
 * Optimistic gate for /admin/*: redirects visitors with no session cookie to the login page
 * before any admin page code runs.
 *
 * This is a UX/performance optimisation, NOT a security boundary – anyone can forge a cookie
 * with that name. Real verification happens in `requireAdmin()` (Admin SDK) inside every
 * admin page and Server Action.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === ADMIN_LOGIN_PATH || request.cookies.has(SESSION_COOKIE_NAME)) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = ADMIN_LOGIN_PATH;
  loginUrl.search = '';
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
