import type { InstagramMedia, InstagramPost } from '@/types';

/** Maps one Instagram API media object to the provider-agnostic post model (or `null`). */
export function mapInstagramMedia(media: InstagramMedia): InstagramPost | null {
  const isVideo = media.media_type === 'VIDEO';
  // Videos expose a still in `thumbnail_url`; images and carousels use `media_url`.
  const imageUrl = isVideo ? media.thumbnail_url : media.media_url;
  if (!imageUrl) return null;

  return {
    id: media.id,
    imageUrl,
    permalink: media.permalink,
    caption: media.caption,
    isVideo,
    postedAt: media.timestamp,
  };
}
