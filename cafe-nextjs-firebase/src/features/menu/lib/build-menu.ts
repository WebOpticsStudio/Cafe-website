import type { ContentSource, MenuData } from '@/types';
import type { MenuCategory, MenuItem } from '@/schemas/menu';

const bySortOrder = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder;

/**
 * Turns flat category/item lists into the structure the UI needs:
 * active categories in order, each with its items, plus a short "featured" list.
 * Pure function – no I/O.
 */
export function buildMenu(
  input: { categories: MenuCategory[]; items: MenuItem[] },
  source: ContentSource,
): MenuData {
  const itemsByCategory = new Map<string, MenuItem[]>();
  for (const item of [...input.items].sort(bySortOrder)) {
    const list = itemsByCategory.get(item.categoryId) ?? [];
    list.push(item);
    itemsByCategory.set(item.categoryId, list);
  }

  const sections = input.categories
    .filter((category) => category.isActive)
    .sort(bySortOrder)
    .map((category) => ({ category, items: itemsByCategory.get(category.id) ?? [] }))
    .filter((section) => section.items.length > 0);

  const featured = sections
    .flatMap((section) => section.items)
    .filter((item) => item.isFeatured && item.isAvailable)
    .slice(0, 4);

  return { sections, featured, source };
}
