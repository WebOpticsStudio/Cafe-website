import 'server-only';
import { cache } from 'react';
import { siteConfig } from '@/config/site';
import { getServerEnv } from '@/lib/env.server';
import { logger } from '@/lib/utils/logger';
import type { InstagramPost } from '@/types';
import { createGraphApiProvider } from '../providers/graph-api.provider';
import { createStaticProvider } from '../providers/static.provider';
import type { InstagramProvider } from '../providers/types';

export interface InstagramFeed {
  /** `live`: from the API · `curated`: hand-picked · `fallback`: nothing to show but a profile link. */
  status: 'live' | 'curated' | 'fallback';
  posts: InstagramPost[];
  handle?: string;
  profileUrl?: string;
}

/**
 * Tries each provider in priority order and returns the first non-empty result.
 * Any failure (missing token, expired token, rate limit, network error) is logged and
 * degrades to the next provider – ultimately to a profile-link fallback. Never throws.
 */
export const getInstagramFeed = cache(async (limit = 6): Promise<InstagramFeed> => {
  const { handle } = siteConfig.instagram;
  const profileUrl = handle ? `https://www.instagram.com/${handle}/` : undefined;

  const token = getServerEnv().INSTAGRAM_ACCESS_TOKEN;
  const providers: InstagramProvider[] = [
    ...(token ? [createGraphApiProvider(token)] : []),
    createStaticProvider(siteConfig.instagram.curatedPosts),
  ];

  for (const provider of providers) {
    try {
      const posts = await provider.getRecentPosts(limit);
      if (posts.length > 0) {
        return {
          status: provider.name === 'static' ? 'curated' : 'live',
          posts,
          handle,
          profileUrl,
        };
      }
    } catch (error) {
      logger.warn('Instagram provider failed; trying the next one', {
        provider: provider.name,
        reason: error instanceof Error ? error.message : 'unknown',
      });
    }
  }

  return { status: 'fallback', posts: [], handle, profileUrl };
});
