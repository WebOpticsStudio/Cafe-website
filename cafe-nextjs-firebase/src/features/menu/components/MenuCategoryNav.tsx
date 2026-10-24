import type { MenuSection } from '@/types';

/** In-page anchor navigation between menu categories. */
export function MenuCategoryNav({ sections }: { sections: MenuSection[] }) {
  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-20 z-20 -mx-4 border-b border-[#E5DDD1] bg-[#FAF7F2]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
    >
      <ul className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {sections.map(({ category }) => (
          <li key={category.id} className="shrink-0">
            <a
              href={`#${category.slug}`}
              className="inline-flex min-h-10 items-center rounded-full border border-[#E5DDD1] bg-white px-5 text-xs font-bold uppercase tracking-wider text-[#1C1510] hover:bg-[#1C1510] hover:text-white transition-all shadow-2xs"
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
