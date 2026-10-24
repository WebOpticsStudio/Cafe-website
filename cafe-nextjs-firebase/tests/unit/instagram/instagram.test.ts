import { afterEach, describe, expect, it, vi } from 'vitest';
import { createGraphApiProvider } from '@/features/instagram/providers/graph-api.provider';
import { mapInstagramMedia } from '@/features/instagram/providers/mapper';

const image = {
  id: '1',
  caption: 'Fresh croissants',
  media_type: 'IMAGE' as const,
  media_url: 'https://scontent.cdninstagram.com/a.jpg',
  permalink: 'https://www.instagram.com/p/abc/',
};

describe('mapInstagramMedia', () => {
  it('maps images and uses thumbnails for videos', () => {
    expect(mapInstagramMedia(image)).toMatchObject({
      id: '1',
      imageUrl: image.media_url,
      isVideo: false,
    });
    expect(
      mapInstagramMedia({
        ...image,
        id: '2',
        media_type: 'VIDEO',
        media_url: 'https://scontent.cdninstagram.com/v.mp4',
        thumbnail_url: 'https://scontent.cdninstagram.com/t.jpg',
      }),
    ).toMatchObject({ imageUrl: 'https://scontent.cdninstagram.com/t.jpg', isVideo: true });
  });

  it('skips media that has no displayable image', () => {
    expect(mapInstagramMedia({ ...image, media_type: 'VIDEO', media_url: undefined })).toBeNull();
  });
});

describe('graph API provider', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('requests the expected fields and returns mapped posts', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [image, { ...image, id: '2', media_type: 'VIDEO' }] }), {
        status: 200,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const posts = await createGraphApiProvider('token-1234567890').getRecentPosts(6);

    expect(posts.map((post) => post.id)).toEqual(['1']); // the video has no thumbnail → skipped
    const requested = new URL(String(fetchMock.mock.calls[0]![0]));
    expect(requested.hostname).toBe('graph.instagram.com');
    expect(requested.searchParams.get('fields')).toContain('permalink');
  });

  it('throws without leaking the token when the API fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })));
    const promise = createGraphApiProvider('super-secret-token').getRecentPosts(3);
    await expect(promise).rejects.toThrow('HTTP 401');
    await expect(promise).rejects.not.toThrow(/super-secret-token/);
  });

  it('rejects unexpected response shapes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{"oops":true}', { status: 200 })),
    );
    await expect(createGraphApiProvider('token-1234567890').getRecentPosts(3)).rejects.toThrow(
      'unexpected response',
    );
  });
});
