import { z } from 'zod';
import { slugSchema } from './common';

export const DIETARY_TAGS = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'contains-nuts',
  'spicy',
] as const;

export const dietaryTagSchema = z.enum(DIETARY_TAGS);

/** Firestore: `menuCategories/{id}` */
export const menuCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(80),
  slug: slugSchema,
  description: z.string().trim().max(300).optional(),
  sortOrder: z.number().int(),
  isActive: z.boolean().default(true),
});

/**
 * Firestore: `menuItems/{id}`.
 * Prices are stored as integers in the currency's minor unit (cents, pence…) to avoid
 * floating-point errors. The currency itself is a site-wide setting.
 */
export const menuItemSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1).max(128),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(''),
  priceMinor: z.number().int().min(0).max(10_000_000),
  imageUrl: z.string().max(2048).optional(),
  dietaryTags: z.array(dietaryTagSchema).max(8).default([]),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int(),
});

/** Input accepted by the "toggle availability" server action (from FormData). */
export const setAvailabilityInputSchema = z.object({
  itemId: z.string().min(1).max(128),
  isAvailable: z.enum(['true', 'false']).transform((value) => value === 'true'),
});

export type DietaryTag = z.infer<typeof dietaryTagSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
