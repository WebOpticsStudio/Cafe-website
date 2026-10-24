import { z } from 'zod';

/** Shape of one media object returned by `GET https://graph.instagram.com/me/media`. */
export const instagramMediaSchema = z.object({
  id: z.string(),
  caption: z.string().optional(),
  media_type: z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']),
  media_url: z.url().optional(),
  thumbnail_url: z.url().optional(),
  permalink: z.url(),
  timestamp: z.string().optional(),
});

export const instagramMediaResponseSchema = z.object({
  data: z.array(instagramMediaSchema),
});

/** Provider-agnostic post model used by the UI. */
export const instagramPostSchema = z.object({
  id: z.string(),
  imageUrl: z.string().min(1),
  permalink: z.url(),
  caption: z.string().optional(),
  isVideo: z.boolean().default(false),
  postedAt: z.string().optional(),
});

export type InstagramMedia = z.infer<typeof instagramMediaSchema>;
export type InstagramPost = z.infer<typeof instagramPostSchema>;
