import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { StateMessage } from '@/components/ui/StateMessage';
import { MenuGridSection } from '@/features/menu/components/MenuGridSection';
import { getMenu } from '@/features/menu/server/menu.service';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Menu | Brewista Coffee & Eatery',
  description: 'Handcrafted espresso, artisan café fast food, pizzas, burgers, fries, and desserts.',
  alternates: { canonical: '/menu' },
};

export default async function MenuPage() {
  const menu = await getMenu();

  // Extract all categories and all items mixed together
  const categories = menu.sections.map((s) => s.category);
  const allItems = menu.sections.flatMap((s) => s.items);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-6 sm:py-8">
      <Container className="max-w-7xl">
        {allItems.length === 0 ? (
          <StateMessage title="The menu is being updated" role="status">
            Please check back shortly, or ask our baristas in person.
          </StateMessage>
        ) : (
          /* ── Interactive Menu Grid: Direct Menu Items View with Single-Line Filter/Search ── */
          <MenuGridSection categories={categories} items={allItems} />
        )}
      </Container>
    </div>
  );
}
