import { ButtonLink } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { MenuItemRow } from '@/features/menu/components/MenuItemRow';
import type { MenuItem } from '@/schemas/menu';

/** A short selection of featured menu items (flagged `isFeatured` in Firestore). */
export function FeaturedItems({ items }: { items: MenuItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section
      id="favourites"
      title="Favourites right now"
      description="A few things people come back for."
    >
      <ul className="grid divide-y divide-line sm:grid-cols-2 sm:gap-x-14 sm:divide-y-0">
        {items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </ul>
      <div className="mt-8">
        <ButtonLink href="/menu" variant="outline">
          See the full menu
        </ButtonLink>
      </div>
    </Section>
  );
}
