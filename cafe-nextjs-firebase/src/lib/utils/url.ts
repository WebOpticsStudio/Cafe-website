import { siteConfig } from '@/config/site';

/** "/menu" → "https://your-domain.example/menu" */
export function absoluteUrl(path = '/'): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
