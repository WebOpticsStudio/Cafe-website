import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { CartProvider } from '@/context/CartContext';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { SkipLink } from './SkipLink';

const CartDrawer = dynamic(
  () => import('@/components/cart/CartDrawer').then((mod) => mod.CartDrawer)
);

/** Public-site chrome: CartProvider, Header, Main, Footer, CartDrawer, and minimal Floating WhatsApp icon. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SkipLink />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-[60vh] focus:outline-none">
        {children}
      </main>
      <SiteFooter />
      <CartDrawer />
      <FloatingWhatsApp />
    </CartProvider>
  );
}
