import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { signOutAction } from '@/features/admin/actions';
import { AvailabilityToggle } from '@/features/admin/components/AvailabilityToggle';
import { requireAdmin } from '@/features/auth/server/session';
import { MenuItemRow } from '@/features/menu/components/MenuItemRow';
import { getMenu } from '@/features/menu/server/menu.service';

export const metadata: Metadata = { title: 'Menu availability' };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireAdmin();
  const menu = await getMenu();
  const canEdit = menu.source === 'firestore';

  return (
    <Container className="py-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">Menu availability</h1>
          <p className="mt-2 text-muted">Signed in as {user.email ?? user.uid}</p>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </header>

      {!canEdit ? (
        <p role="status" className="mt-8 rounded-lg bg-marigold-300/40 p-4">
          The menu is showing built-in sample data, so changes are disabled. Run{' '}
          <code>npm run seed</code> to copy it into Firestore.
        </p>
      ) : null}

      {menu.sections.map(({ category, items }) => (
        <section key={category.id} aria-labelledby={`admin-${category.slug}`} className="mt-10">
          <h2 id={`admin-${category.slug}`} className="text-2xl font-bold">
            {category.name}
          </h2>
          <ul className="mt-2 divide-y divide-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4">
                <ul className="min-w-0 flex-1">
                  <MenuItemRow item={item} />
                </ul>
                <AvailabilityToggle
                  itemId={item.id}
                  itemName={item.name}
                  isAvailable={item.isAvailable}
                  disabled={!canEdit}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Container>
  );
}
