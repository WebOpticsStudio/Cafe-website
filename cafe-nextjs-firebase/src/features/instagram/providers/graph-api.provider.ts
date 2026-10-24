import 'server-only';
import { instagramMediaResponseSchema } from '@/schemas/instagram';
import { mapInstagramMedia } from './mapper';
import { InstagramProviderError, type InstagramProvider } from './types';

const API_BASE = 'https://graph.instagram.com/me/media';
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

/**
 * Instagram API (with Instagram Login) provider. Requires a long-lived access token for the
 * cafe's professional account (see README → Instagram).
 *
 * The token is only ever used server-side. Errors deliberately never include the request
 * URL, because it contains the token.
 */
export function createGraphApiProvider(accessToken: string): InstagramProvider {
  return {
    name: 'instagram-graph-api',

    async getRecentPosts(limit) {
      const url = new URL(API_BASE);
      url.searchParams.set('fields', FIELDS);
      url.searchParams.set('limit', String(Math.min(Math.max(limit, 1), 25)));
      url.searchParams.set('access_token', accessToken);

      const response = await fetch(url, {
        next: { revalidate: 3600 }, // cache 1h – protects the rate limit and page speed
        signal: AbortSignal.timeout(5_000),
      });

      if (!response.ok) {
        throw new InstagramProviderError(`Instagram API responded with HTTP ${response.status}`);
      }

      const parsed = instagramMediaResponseSchema.safeParse(await response.json());
      if (!parsed.success) {
        throw new InstagramProviderError('Instagram API returned an unexpected response shape');
      }

      return parsed.data.data
        .map(mapInstagramMedia)
        .filter((post): post is NonNullable<typeof post> => post !== null)
        .slice(0, limit);
    },
  };
}
