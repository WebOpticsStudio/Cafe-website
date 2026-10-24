import type { InstagramPost } from '@/types';
import type { InstagramProvider } from './types';

/**
 * Serves hand-picked posts from `siteConfig.instagram.curatedPosts`
 * (images stored under /public). Empty by default; a zero-cost way to show a feed
 * without any API credentials.
 */
export function createStaticProvider(posts: InstagramPost[]): InstagramProvider {
  return {
    name: 'static',
    async getRecentPosts(limit) {
      return posts.slice(0, limit);
    },
  };
}
