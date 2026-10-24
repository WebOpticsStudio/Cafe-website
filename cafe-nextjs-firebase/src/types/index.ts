/**
 * Domain models are derived from the Zod schemas so that runtime validation and
 * compile-time types can never drift apart.
 */
import type { MenuCategory, MenuItem } from '@/schemas/menu';

export type { LoginInput } from '@/schemas/auth';
export type { HoursException, OpeningHours, TimeInterval, Weekday } from '@/schemas/hours';
export type { InstagramMedia, InstagramPost } from '@/schemas/instagram';
export type { DietaryTag, MenuCategory, MenuItem } from '@/schemas/menu';

/** Where a piece of content came from – useful for logging and the admin banner. */
export type ContentSource = 'firestore' | 'seed';

/** Return type of Server Actions: serialisable and never throws to the client. */
export type ActionResult = { ok: true; message?: string } | { ok: false; error: string };

export interface MenuSection {
  category: MenuCategory;
  items: MenuItem[];
}

export interface MenuData {
  sections: MenuSection[];
  featured: MenuItem[];
  source: ContentSource;
}
