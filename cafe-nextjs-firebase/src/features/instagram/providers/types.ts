import type { InstagramPost } from '@/types';

/**
 * Contract every Instagram data source implements. Adding a new source (a third-party
 * widget API, a Firestore collection managed by staff…) means writing one more provider –
 * the UI and service do not change.
 */
export interface InstagramProvider {
  readonly name: string;
  getRecentPosts(limit: number): Promise<InstagramPost[]>;
}

export class InstagramProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InstagramProviderError';
  }
}
