import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('getInstagramFeed fallback behaviour', () => {
  it('falls back to a profile link when no token is configured', async () => {
    vi.stubEnv('INSTAGRAM_ACCESS_TOKEN', '');
    vi.stubEnv('NEXT_PUBLIC_INSTAGRAM_HANDLE', 'kettle_and_fern');
    const { getInstagramFeed } = await import('@/features/instagram/server/instagram.service');

    const feed = await getInstagramFeed(6);
    expect(feed.status).toBe('fallback');
    expect(feed.posts).toEqual([]);
    expect(feed.profileUrl).toBe('https://www.instagram.com/kettle_and_fern/');
  });

  it('degrades gracefully (no throw) when the API call fails', async () => {
    vi.stubEnv('INSTAGRAM_ACCESS_TOKEN', 'token-1234567890');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { getInstagramFeed } = await import('@/features/instagram/server/instagram.service');

    await expect(getInstagramFeed(6)).resolves.toMatchObject({ status: 'fallback', posts: [] });
  });
});
