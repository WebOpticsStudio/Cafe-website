import type { DietaryTag } from '@/schemas/menu';

const LABELS: Record<DietaryTag, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-free': 'Gluten-free',
  'dairy-free': 'Dairy-free',
  'contains-nuts': 'Contains nuts',
  spicy: 'Spicy',
};

/** Dietary info as readable text (never colour- or icon-only). */
export function DietaryBadges({ tags }: { tags: DietaryTag[] }) {
  if (tags.length === 0) return null;
  return (
    <ul aria-label="Dietary information" className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-md border border-forest-100 px-2 py-0.5 text-sm font-medium text-forest-700"
        >
          {LABELS[tag]}
        </li>
      ))}
    </ul>
  );
}
