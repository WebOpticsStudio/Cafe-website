import type { MenuSection as MenuSectionData } from '@/types';
import { MenuItemRow } from './MenuItemRow';

export function MenuSection({ section }: { section: MenuSectionData }) {
  const { category, items } = section;
  const headingId = `${category.slug}-heading`;

  return (
    <section id={category.slug} aria-labelledby={headingId} className="scroll-mt-24 py-10">
      <h2 id={headingId} className="text-3xl font-bold">
        {category.name}
      </h2>
      {category.description ? <p className="mt-2 text-muted">{category.description}</p> : null}
      <ul className="mt-4 divide-y divide-line">
        {items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
