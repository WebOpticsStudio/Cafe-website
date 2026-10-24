'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';
import { useDisclosure } from '@/hooks/useDisclosure';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation: inline links on desktop, a disclosure panel on mobile. */
export function HeaderNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const { isOpen, close, toggle } = useDisclosure();

  const linkClass = (href: string) =>
    cn(
      'rounded-full px-4 py-2 text-base font-medium transition-colors hover:bg-forest-50',
      pathname === href || pathname.startsWith(`${href}/`)
        ? 'text-forest-700 underline decoration-2 underline-offset-8'
        : 'text-ink',
    );

  return (
    <>
      <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClass(item.href)}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className="-mr-2 inline-flex size-12 items-center justify-center rounded-full hover:bg-forest-50 md:hidden"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        onClick={toggle}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
        <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      </button>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!isOpen}
        className="absolute inset-x-0 top-full border-b border-line bg-canvas shadow-sm md:hidden"
      >
        <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
          {[{ label: 'Home', href: '/' }, ...items].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={close}
                className="block rounded-lg px-3 py-3 text-lg font-medium hover:bg-forest-50"
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
