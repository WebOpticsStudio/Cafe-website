import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/utils/url';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/menu'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/visit'), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
