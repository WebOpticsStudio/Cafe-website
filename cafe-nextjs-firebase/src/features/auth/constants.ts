/**
 * Shared by the proxy (Edge-safe: no server-only imports) and the server code.
 *
 * The cookie is named `__session` because Firebase Hosting / App Hosting's CDN strips
 * every other cookie from requests that reach the server.
 */
export const SESSION_COOKIE_NAME = '__session';

/** Session cookie lifetime. Firebase allows 5 minutes – 14 days. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;

/** A fresh sign-in is required to mint a session cookie (defence against stolen old tokens). */
export const MAX_AUTH_AGE_SECONDS = 5 * 60;

export const ADMIN_LOGIN_PATH = '/admin/login';
