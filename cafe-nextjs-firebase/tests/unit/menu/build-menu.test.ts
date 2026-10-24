import { describe, expect, it } from 'vitest';
import { seedCategories, seedItems } from '@/data/seed/menu';
import { buildMenu } from '@/features/menu/lib/build-menu';
import { menuCategorySchema, menuItemSchema, setAvailabilityInputSchema } from '@/schemas/menu';
import { formatPrice } from '@/lib/utils/format';

describe('seed data', () => {
  it('is valid against the Zod schemas', () => {
    for (const category of seedCategories)
      expect(menuCategorySchema.safeParse(category).success).toBe(true);
    for (const item of seedItems) expect(menuItemSchema.safeParse(item).success).toBe(true);
  });

  it('only references categories that exist', () => {
    const ids = new Set(seedCategories.map((category) => category.id));
    expect(seedItems.every((item) => ids.has(item.categoryId))).toBe(true);
  });
});

describe('buildMenu', () => {
  const [coffee, tea] = seedCategories;
  const item = (id: string, categoryId: string, sortOrder: number, extra = {}) => ({
    ...seedItems[0]!,
    id,
    categoryId,
    sortOrder,
    isFeatured: false,
    ...extra,
  });

  it('orders categories and items, hides inactive and empty categories', () => {
    const menu = buildMenu(
      {
        categories: [
          { ...tea!, sortOrder: 20 },
          { ...coffee!, sortOrder: 10 },
          { ...coffee!, id: 'hidden', slug: 'hidden', isActive: false },
          { ...coffee!, id: 'empty', slug: 'empty', sortOrder: 30 },
        ],
        items: [item('b', tea!.id, 2), item('a', tea!.id, 1), item('c', coffee!.id, 1)],
      },
      'seed',
    );

    expect(menu.sections.map((section) => section.category.id)).toEqual([coffee!.id, tea!.id]);
    expect(menu.sections[1]!.items.map((entry) => entry.id)).toEqual(['a', 'b']);
  });

  it('features only available, flagged items (max 4)', () => {
    const items = [
      ...Array.from({ length: 6 }, (_, index) =>
        item(`f${index}`, coffee!.id, index, { isFeatured: true }),
      ),
      item('sold-out', coffee!.id, 99, { isFeatured: true, isAvailable: false }),
    ];
    const menu = buildMenu({ categories: [coffee!], items }, 'firestore');
    expect(menu.featured).toHaveLength(4);
    expect(menu.featured.some((entry) => entry.id === 'sold-out')).toBe(false);
    expect(menu.source).toBe('firestore');
  });
});

describe('menu schemas and formatting', () => {
  it('rejects negative or fractional prices', () => {
    expect(menuItemSchema.safeParse({ ...seedItems[0], priceMinor: -1 }).success).toBe(false);
    expect(menuItemSchema.safeParse({ ...seedItems[0], priceMinor: 4.5 }).success).toBe(false);
  });

  it('parses the availability form input', () => {
    expect(setAvailabilityInputSchema.parse({ itemId: 'x', isAvailable: 'false' })).toEqual({
      itemId: 'x',
      isAvailable: false,
    });
    expect(setAvailabilityInputSchema.safeParse({ itemId: '', isAvailable: 'true' }).success).toBe(
      false,
    );
    expect(
      setAvailabilityInputSchema.safeParse({ itemId: 'x', isAvailable: 'maybe' }).success,
    ).toBe(false);
  });

  it('formats prices from minor units, including zero-decimal currencies', () => {
    expect(formatPrice(450, 'USD', 'en-US')).toBe('$4.50');
    expect(formatPrice(450, 'JPY', 'ja-JP').replace(/\D/g, '')).toBe('450');
  });
});
