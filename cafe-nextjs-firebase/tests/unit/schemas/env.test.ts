import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('public env validation', () => {
  it('treats empty strings as "not set"', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '');
    vi.stubEnv('NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY', '');
    const { publicEnv } = await import('@/lib/env');
    expect(publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER).toBeUndefined();
    expect(publicEnv.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY).toBeUndefined();
  });

  it('fails fast on a malformed WhatsApp number', async () => {
    vi.stubEnv('NEXT_PUBLIC_WHATSAPP_NUMBER', '+1 555 CALL ME');
    await expect(import('@/lib/env')).rejects.toThrow(/NEXT_PUBLIC_WHATSAPP_NUMBER/);
  });

  it('fails fast on a malformed site URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'not a url');
    await expect(import('@/lib/env')).rejects.toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
});
