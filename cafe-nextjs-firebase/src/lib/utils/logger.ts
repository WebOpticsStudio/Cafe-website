/**
 * Tiny structured logger. Swap the body for Cloud Logging / Sentry later without
 * touching call sites. Never pass secrets or personal data in `meta`.
 */
type Meta = Record<string, unknown>;

function serialise(error: unknown): unknown {
  return error instanceof Error ? { name: error.name, message: error.message } : error;
}

export const logger = {
  warn(message: string, meta?: Meta) {
    console.warn(JSON.stringify({ severity: 'WARNING', message, ...meta }));
  },
  error(message: string, error?: unknown, meta?: Meta) {
    console.error(JSON.stringify({ severity: 'ERROR', message, error: serialise(error), ...meta }));
  },
};
